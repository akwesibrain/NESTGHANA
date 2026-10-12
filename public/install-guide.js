(() => {
  "use strict";

  const SHOW_DELAY_MS = 4000;
  const AFTER_COOKIE_DELAY_MS = 1500;
  const SNOOZE_DAYS = 7;
  const STORAGE_KEY = "nestgh-install-guide-dismissed-at";
  const OPEN_EVENT = "nest:open-install-guide";

  const ICON_SHARE =
    '<svg class="ig-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V3"/><path d="m7 8 5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
  const ICON_MENU =
    '<svg class="ig-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
  const ICON_PLUS =
    '<svg class="ig-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';

  const TABS = [
    {
      id: "ios-safari",
      label: "iPhone · Safari",
      steps: [
        "Open NestGH in <b>Safari</b>.",
        `Tap the <b>Share</b> button ${ICON_SHARE} at the bottom of the screen.`,
        `Scroll down and tap <b>Add to Home Screen</b> ${ICON_PLUS}.`,
        "Tap <b>Add</b> in the top-right corner.",
      ],
    },
    {
      id: "ios-chrome",
      label: "iPhone · Chrome",
      steps: [
        "Open NestGH in <b>Chrome</b>.",
        `Tap the <b>Share</b> button ${ICON_SHARE} next to the address bar (or open the menu ${ICON_MENU}).`,
        `Choose <b>Add to Home Screen</b> ${ICON_PLUS}.`,
        "Tap <b>Add</b>.",
      ],
      note: "Can't see the option? Open NestGH in Safari instead and follow the Safari steps.",
    },
    {
      id: "android-chrome",
      label: "Android · Chrome",
      steps: [
        "Open NestGH in <b>Chrome</b>.",
        `Tap the <b>menu</b> ${ICON_MENU} (three dots) at the top-right.`,
        "Tap <b>Install app</b> (or <b>Add to Home screen</b>).",
        "Tap <b>Install</b>.",
      ],
    },
  ];

  let deferredPrompt = null;
  let root = null;
  let activeTab = TABS[0].id;
  let previousOverflow = "";
  let previousFocus = null;
  let showTimer = 0;
  let isOpen = false;

  function readDismissedAt() {
    try {
      const value = Number(window.localStorage.getItem(STORAGE_KEY));
      return Number.isFinite(value) ? value : 0;
    } catch {
      return 0;
    }
  }

  function saveDismissedAt() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* private mode: ignore */
    }
  }

  function isSnoozed() {
    const at = readDismissedAt();
    return at > 0 && Date.now() - at < SNOOZE_DAYS * 86400000;
  }

  function detectDevice() {
    const ua = navigator.userAgent || "";
    const isIos =
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIos) return { mobile: true, tab: /CriOS/.test(ua) ? "ios-chrome" : "ios-safari" };
    if (/Android/.test(ua)) return { mobile: true, tab: "android-chrome" };
    return { mobile: false, tab: "ios-safari" };
  }

  function isInstalled() {
    return (
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      navigator.standalone === true
    );
  }

  function build() {
    root = document.createElement("div");
    root.className = "ig-overlay";
    root.hidden = true;
    root.innerHTML = `
      <div class="ig-sheet" role="dialog" aria-modal="true" aria-labelledby="ig-title">
        <button type="button" class="ig-close" aria-label="Close">&times;</button>
        <img class="ig-logo" src="icons/icon-192.png" alt="" width="56" height="56">
        <h2 id="ig-title">Install NestGH on your phone</h2>
        <p class="ig-sub">Find rooms, houses and hostels faster. Open NestGH like an app from your Home Screen.</p>
        <div class="ig-tabs" role="tablist" aria-label="Choose your phone and browser"></div>
        <div class="ig-panel" role="tabpanel"></div>
        <div class="ig-actions">
          <button type="button" class="ig-install" hidden>Install now</button>
          <button type="button" class="ig-later">Maybe later</button>
        </div>
      </div>`;
    const tabs = root.querySelector(".ig-tabs");
    TABS.forEach((tab) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ig-tab";
      b.setAttribute("role", "tab");
      b.dataset.tab = tab.id;
      b.textContent = tab.label.replace(" · ", "\u00a0·\u00a0");
      tabs.appendChild(b);
    });
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".ig-tab");
      if (b) selectTab(b.dataset.tab);
    });
    tabs.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const i = TABS.findIndex((t) => t.id === activeTab);
      const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
      selectTab(next.id);
      tabs.querySelector(`[data-tab="${next.id}"]`).focus();
    });
    root.addEventListener("click", (e) => {
      if (e.target === root) close();
    });
    root.querySelector(".ig-close").addEventListener("click", close);
    root.querySelector(".ig-later").addEventListener("click", close);
    root.querySelector(".ig-install").addEventListener("click", installNow);
    document.body.appendChild(root);
  }

  function selectTab(id) {
    activeTab = id;
    const tab = TABS.find((t) => t.id === id) || TABS[0];
    root.querySelectorAll(".ig-tab").forEach((b) => {
      const on = b.dataset.tab === tab.id;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    const panel = root.querySelector(".ig-panel");
    panel.innerHTML =
      `<ol class="ig-steps">${tab.steps.map((s) => `<li>${s}</li>`).join("")}</ol>` +
      (tab.note ? `<p class="ig-note">${tab.note}</p>` : "");
    root.querySelector(".ig-install").hidden = !(tab.id === "android-chrome" && deferredPrompt);
  }

  function open(preferredTab) {
    if (isOpen) return;
    if (!root) build();
    isOpen = true;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    selectTab(preferredTab || detectDevice().tab);
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("is-open"));
    root.querySelector(".ig-close").focus();
    document.addEventListener("keydown", onKeydown);
  }

  function hide() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove("is-open");
    root.hidden = true;
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", onKeydown);
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  function close() {
    saveDismissedAt();
    hide();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;
    const items = [...root.querySelectorAll("button:not([hidden]):not([tabindex='-1'])")];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  async function installNow() {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt;
    deferredPrompt = null;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch {
      /* user closed the prompt */
    }
    hide();
  }

  function onBeforeInstallPrompt(e) {
    e.preventDefault();
    deferredPrompt = e;
    if (isOpen) selectTab(activeTab);
  }

  function onAppInstalled() {
    deferredPrompt = null;
    window.clearTimeout(showTimer);
    hide();
  }

  function onOpenRequest() {
    open();
  }

  function init() {
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener(OPEN_EVENT, onOpenRequest);
    window.addEventListener("pagehide", () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener(OPEN_EVENT, onOpenRequest);
      document.removeEventListener("keydown", onKeydown);
    });
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-install-guide]")) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(OPEN_EVENT));
      }
    });

    const device = detectDevice();
    if (!device.mobile || isInstalled() || isSnoozed()) return;
    const schedule = (delay) => {
      window.clearTimeout(showTimer);
      showTimer = window.setTimeout(() => {
        // Never stack the guide on top of something else the visitor is in the middle of.
        if (isInstalled() || isSnoozed() || isOpen || document.body.classList.contains("modal-open")) return;
        open(device.tab);
      }, delay);
    };

    // One interruption at a time: while the cookie banner is waiting for an answer, hold the guide
    // back and show it shortly after the visitor has made their choice.
    const cookieBanner = document.getElementById("cookie-banner");
    if (cookieBanner && !cookieBanner.hidden) {
      const observer = new MutationObserver(() => {
        if (!cookieBanner.hidden) return;
        observer.disconnect();
        schedule(AFTER_COOKIE_DELAY_MS);
      });
      observer.observe(cookieBanner, { attributes: true, attributeFilter: ["hidden"] });
      window.addEventListener("pagehide", () => observer.disconnect());
      return;
    }
    schedule(SHOW_DELAY_MS);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

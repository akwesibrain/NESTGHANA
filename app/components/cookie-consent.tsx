"use client";

import { useState, useSyncExternalStore } from "react";

type Choice = "accepted" | "rejected";
const storageKey = "nestgh_cookie_consent_v1";
const listeners = new Set<() => void>();
let sessionChoice: Choice | null = null;

function getChoice(): Choice | null {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const value = JSON.parse(saved) as { choice?: unknown };
      if (value.choice === "accepted" || value.choice === "rejected") return value.choice;
    }
  } catch (error) {
    console.error("cookie_consent_read_failed", error);
  }
  return sessionChoice;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) sessionChoice = null;
    listener();
  }
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function CookieConsent() {
  const choice = useSyncExternalStore(subscribe, getChoice, () => null);
  const [storageError, setStorageError] = useState(false);

  function saveChoice(value: Choice) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ choice: value, updatedAt: new Date().toISOString() }));
      setStorageError(false);
    } catch (error) {
      console.error("cookie_consent_save_failed", error);
      setStorageError(true);
    }
    sessionChoice = value;
    notify();
  }

  function reopen() {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("cookie_consent_reset_failed", error);
      setStorageError(true);
    }
    sessionChoice = null;
    notify();
  }

  return (
    <>
      {choice === null ? (
        <aside className="cookie-consent" aria-label="Cookie preferences">
          <div>
            <strong>Your privacy matters</strong>
            <p>We use essential browser storage where needed. Optional analytics and advertising cookies are not active.</p>
            <a href="/privacy">Read our privacy notice</a>
            {storageError ? <p role="alert">Your choice may not be saved in this browser.</p> : null}
          </div>
          <div className="cookie-consent-actions">
            <button type="button" className="cookie-reject" onClick={() => saveChoice("rejected")}>Reject</button>
            <button type="button" className="cookie-accept" onClick={() => saveChoice("accepted")}>Accept cookies</button>
          </div>
        </aside>
      ) : null}
      <button className="cookie-settings" type="button" onClick={reopen}>Cookie settings</button>
    </>
  );
}

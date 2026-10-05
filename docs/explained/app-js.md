# app.js explained

This file is like the main control room in a house.

## app.js

### Lines 1-17

```js
const IC = {
  home: '<path d="M3 11 12 3l9 8v10H3zM9 21v-6h6v6"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  user: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6"/>',
  clock: '<path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/>',
  heart:
    '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',
  search: '<path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8zM7.5 8.5h.01"/>',
};
```

- This starts an object named `IC`. An object is like a labeled cubby shelf where each label points to some data. The word **const** makes a named storage box. A **variable** is like a labeled toy box that holds a value.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 18-21

```js
const ico = (n) =>
  `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js");
```

- This makes a short helper function named `ico`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure. An **array** is like a row of lunch boxes holding many items in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently. The **DOM** is the page's big tree of boxes in the browser. `document` is the browser's way to look through that tree.

### Lines 22-25

```js
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This goes through each item one by one and does the same kind of job for each.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 26-29

```js
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
```

- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 30-33

```js
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  document
    .querySelectorAll("[data-reveal]")
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order. `querySelectorAll` means “find all the matching page parts.” `querySelector` means “find the first page part that matches this label.”

### Lines 34-37

```js
    .forEach((element) => revealObserver.observe(element));
}
const nav = document.querySelector("nav");
const backToTop = document.getElementById("back-to-top");
```

- This goes through each item one by one and does the same kind of job for each.
- This closes the piece of code that was opened just above.
- This makes a box named `nav` and stores the first matching page part. It is like asking the page, “please point me to this thing.”
- This makes a box named `backToTop` and fills it with one page part found by its ID. It is like putting a sticky note on one exact door so the code can reach it quickly later. `getElementById` means “find the page part with this exact ID name.”

### Lines 38-41

```js
let scrollUpdatePending = false;
function updateScrollChrome() {
  const y = window.scrollY;
  nav.classList.toggle("is-scrolled", y > 24);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order. The word **let** also makes a variable, but this kind of box is allowed to change later.
- This starts a function named `updateScrollChrome`. It is a little recipe card the file can use later. A **function** is like a little recipe card: give it a name, and the code can run those steps later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This flips a CSS class on or off, like a light switch.

### Lines 42-45

```js
  backToTop.hidden = y <= 600;
  backToTop.toggleAttribute("data-visible", y > 600);
  scrollUpdatePending = false;
}
```

- This chooses whether a page part should be hidden or shown.
- This turns an HTML attribute on or off.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 46-49

```js
window.addEventListener(
  "scroll",
  () => {
    if (scrollUpdatePending) return;
```

- This tells the page to listen for something happening and then run code when it happens. An **event listener** is like a doorbell: when something happens, this code wakes up and reacts.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 50-53

```js
    scrollUpdatePending = true;
    window.requestAnimationFrame(updateScrollChrome);
  },
  { passive: true },
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This asks the browser to wait until the next screen paint before updating things, which helps animations feel smoother.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 54-57

```js
);
updateScrollChrome();
backToTop.addEventListener("click", () => {
  window.scrollTo({
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This tells the page to listen for something happening and then run code when it happens.
- This moves the view so the person can see the important part.

### Lines 58-61

```js
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This asks the browser about a user setting, like whether motion should be reduced.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 62-65

```js
  });
});
const REGIONS = [
  "Ahafo",
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This starts an array named `REGIONS`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 66-69

```js
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 70-73

```js
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 74-77

```js
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 78-81

```js
  "Volta",
  "Western",
  "Western North",
];
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 82-87

```js
const TYPE = {
  single: "Single room",
  chamber: "Chamber and hall",
  self: "Self-contained",
  hostel: "Hostel",
};
```

- This starts an object named `TYPE`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 88-125

```js
const NB = {
  "Tema|Community 20": [
    ["Community 18", "Tema", 2, 8, 15],
    ["Community 25", "Tema", 3, 10, 20],
    ["Adjei Kojo", "Tema", 4, 15, 25],
    ["Sakumono", "Tema", 5, 15, 30],
    ["Ashaiman", "Tema", 6, 20, 35],
  ],
  "Tema|Community 18": [
    ["Community 20", "Tema", 2, 8, 15],
    ["Community 25", "Tema", 4, 12, 22],
    ["Ashaiman", "Tema", 5, 15, 30],
  ],
  "Tema|Community 25": [
    ["Community 20", "Tema", 3, 10, 20],
    ["Sakumono", "Tema", 4, 12, 25],
    ["Adjei Kojo", "Tema", 5, 15, 30],
  ],
  "Tema|Adjei Kojo": [
    ["Community 20", "Tema", 4, 15, 25],
    ["Ashaiman", "Tema", 5, 15, 25],
    ["Community 25", "Tema", 5, 15, 30],
  ],
  "Tema|Ashaiman": [
    ["Adjei Kojo", "Tema", 5, 15, 25],
    ["Community 20", "Tema", 6, 20, 35],
    ["Sakumono", "Tema", 6, 20, 35],
  ],
  "Tema|Sakumono": [
    ["Community 25", "Tema", 4, 12, 25],
    ["Community 20", "Tema", 5, 15, 30],
    ["Ashaiman", "Tema", 6, 20, 35],
  ],
  "Accra|Madina": [["Kwabenya", "Accra", 5, 15, 30]],
  "Accra|Kwabenya": [["Madina", "Accra", 5, 15, 30]],
  "Kumasi|Ayeduase": [["Bomso", "Kumasi", 3, 10, 20]],
  "Kumasi|Bomso": [["Ayeduase", "Kumasi", 3, 10, 20]],
};
```

- This starts an object named `NB`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 126-127

```js
let ROOMS = [];
let TOWN_RECORDS = [];
```

- This starts an array named `ROOMS`. It is a built-in list the rest of the file will look up later.
- This starts an array named `TOWN_RECORDS`. It is a built-in list the rest of the file will look up later.

### Lines 128-129

```js
let CAMPUS = {};
let locationCatalogPromise = null;
```

- This starts an object named `CAMPUS`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 130-133

```js
const LISTING_PAGE_SIZE = 24;
let listingOffset = 0,
  hasMoreListings = true,
  isLoadingListings = false;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 134-139

```js
const DEF = {
  single: { bath: "Shared", kit: "Shared", size: "about 12 m²" },
  chamber: { bath: "Private", kit: "Private", size: "about 30 m²" },
  self: { bath: "Private", kit: "Private", size: "about 20 m²" },
  hostel: { bath: "Shared", kit: "Shared", size: "shared room" },
};
```

- This starts an object named `DEF`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 140-143

```js
const $ = (id) => document.getElementById(id),
  town = $("town"),
  region = $("region"),
  area = $("area"),
```

- This makes a short helper function named `$`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 144-147

```js
  ty = $("ty"),
  max = $("max"),
  camp = $("camp"),
  stu = $("stu"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 148-150

```js
  saved = new Set(),
  must = new Set(),
  commercialRegion = $("commercial-region"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order. A **Set** is like a sticker album that keeps only one copy of each sticker.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 151-154

```js
  commercialTown = $("commercial-town");
const regionOptions = REGIONS.map(
  (name) => `<option value="${name}">${name}</option>`,
).join("");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it. `.map(...)` means “go through each item and build a new list from it.”
- This line is building HTML text, which is the page's visible structure.
- This sticks many pieces together into one bigger text.

### Lines 155-158

```js
region.insertAdjacentHTML("beforeend", regionOptions);
commercialRegion.insertAdjacentHTML("beforeend", regionOptions);
let savedOnly = false;
let browseCategory = "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 159-162

```js
let listingFeePesewas = null;
const supabaseClient =
  window.supabase?.createClient && window.NESTGH_SUPABASE_CONFIG?.publishableKey
    ? window.supabase.createClient(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 163-166

```js
        window.NESTGH_SUPABASE_CONFIG.url,
        window.NESTGH_SUPABASE_CONFIG.publishableKey,
      )
    : null;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 167-170

```js
let listingLoadFailed = false;
const commercial = {
  listings: [],
  filters: null,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts an object named `commercial`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 171-174

```js
  offset: 0,
  hasMore: false,
  loading: false,
  requested: false,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 175-178

```js
  requestId: 0,
};
function updateModalScroll() {
  document.body.classList.toggle(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `updateModalScroll`. It is a little recipe card the file can use later.
- This flips a CSS class on or off, like a light switch.

### Lines 179-182

```js
    "modal-open",
    ["sheet", "lf", "pol", "psheet"].some((id) =>
      $(id).classList.contains("on"),
    ),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 183-186

```js
  );
}
try {
  const stored = JSON.parse(
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This opens JSON text and turns it back into normal data the code can use. `JSON` is a plain text way to pack data so it can be saved or sent around easily.

### Lines 187-190

```js
    localStorage.getItem("nestgh_saved_rooms_v1") || "[]",
  );
  if (Array.isArray(stored))
    stored
```

- This reads from or writes to the browser's long-term little cupboard. `localStorage` is the browser’s little cupboard for saving things even after the page closes.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 191-194

```js
      .filter((id) => typeof id === "string")
      .forEach((id) => saved.add(id));
} catch (error) {
  console.error("Could not read saved rooms:", error);
```

- This keeps only the items that match the rule. `.filter(...)` means “keep only the items that pass the rule.”
- This goes through each item one by one and does the same kind of job for each.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 195-198

```js
}
document.querySelectorAll("i[data-ic]").forEach((e) => {
  e.outerHTML = ico(e.dataset.ic);
});
```

- This closes the piece of code that was opened just above.
- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 199-202

```js
const ghs = (n) => "GH₵ " + Number(n || 0).toLocaleString("en-GH");
const formatFeePesewas = (value) =>
  "GH₵ " +
  (value / 100).toLocaleString("en-GH", {
```

- This makes a short helper function named `ghs`. It is a tiny shortcut recipe.
- This makes a short helper function named `formatFeePesewas`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This formats a number so people see it in a friendly way.

### Lines 203-206

```js
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const htmlEsc = (value) =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This makes a short helper function named `htmlEsc`. It is a tiny shortcut recipe.

### Lines 207-210

```js
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
```

- This swaps one bit of text for another.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 211-214

```js
        c
      ],
  );
const locationKey = (value) =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This makes a short helper function named `locationKey`. It is a tiny shortcut recipe.

### Lines 215-218

```js
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This swaps one bit of text for another.
- This tidies text by cutting off extra spaces at the ends.

### Lines 219-222

```js
    .toLocaleLowerCase();
function chooseTown(place) {
  region.value = place.region;
  populateTownOptions(region, place.region, place.name);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `chooseTown`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 223-226

```js
  town.value = place.name;
  area.value = "";
  fillAreas();
  render();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 227-230

```js
}
function populateTownOptions(select, regionName, selectedName = "") {
  const places = regionName
    ? TOWN_RECORDS.filter((place) => place.region === regionName)
```

- This closes the piece of code that was opened just above.
- This starts a function named `populateTownOptions`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.

### Lines 231-234

```js
    : [];
  select.replaceChildren(
    new Option(
      regionName ? "All towns" : "Select a region first",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 235-238

```js
      "",
    ),
    ...places.map((place) => new Option(place.name, place.name)),
  );
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This closes the piece of code that was opened just above.

### Lines 239-242

```js
  select.disabled = !regionName;
  if (selectedName && places.some((place) => place.name === selectedName))
    select.value = selectedName;
}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 243-246

```js
function populateOwnerTownOptions(query = "", regionName = "") {
  const datalist = $("tl");
  if (!datalist) return;
  if (!regionName) {
```

- This starts a function named `populateOwnerTownOptions`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 247-250

```js
    datalist.replaceChildren();
    return;
  }
  const prefix = locationKey(query);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 251-254

```js
  const options = TOWN_RECORDS.filter(
    (place) =>
      (!regionName || place.region === regionName) &&
      (!prefix || place.key.startsWith(prefix)),
```

- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 255-258

```js
  );
  datalist.replaceChildren(
    ...options.map((place) => {
      const option = document.createElement("option");
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This makes a brand-new page element in memory so the code can add it to the page.

### Lines 259-262

```js
      option.value = place.name;
      option.label = `${place.name} — ${place.region} Region`;
      return option;
    }),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 263-266

```js
  );
}
async function loadLocationCatalog() {
  let catalog = window.NESTGH_LOCATION_CATALOG;
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This starts a function named `loadLocationCatalog`. It is a little recipe card the file can use later and it may pause while waiting for slow work. A special word like **async** means this recipe can pause while waiting for something slow, like waiting for toast to pop up.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 267-270

```js
  if (!catalog) {
    const paths = [
      new URL("ghana-locations.json", document.baseURI),
      new URL("data/ghana-locations.json", document.baseURI),
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This starts an array named `paths`. It is a built-in list the rest of the file will look up later.
- This builds or checks a web address in a careful way.
- This builds or checks a web address in a careful way.

### Lines 271-274

```js
    ];
    let lastError;
    for (const path of paths) {
      try {
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 275-278

```js
        const response = await fetch(path);
        if (!response.ok)
          throw new Error(`Town directory request failed with HTTP ${response.status}.`);
        catalog = await response.json();
```

- This asks for data from another place, like sending someone to the shop to bring something back. The word **await** means “wait right here for the result before doing the next step,” like waiting for the microwave to beep. `fetch` is how the browser politely asks another place for data, like asking the kitchen window for food.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This stops the normal path and sends out an error message.
- This waits for a slow job to finish before moving on.

### Lines 279-282

```js
        break;
      } catch (error) {
        lastError = error;
      }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 283-286

```js
    }
    if (!catalog) throw lastError || new Error("Town directory is unavailable.");
  }
  if (!Array.isArray(catalog.regions) || !Array.isArray(catalog.campuses))
```

- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 287-290

```js
    throw new Error("Town directory data is invalid.");
  const regionNames = catalog.regions.map((entry) => entry.name);
  if (
    regionNames.length !== REGIONS.length ||
```

- This stops the normal path and sends out an error message.
- This walks through each item in a list and makes a new list from it.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 291-294

```js
    REGIONS.some((name) => !regionNames.includes(name)) ||
    catalog.regions.some(
      (entry) =>
        !entry ||
```

- This checks whether at least one item in the list matches the rule.
- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 295-298

```js
        typeof entry.name !== "string" ||
        !Array.isArray(entry.towns) ||
        entry.towns.some((name) => typeof name !== "string"),
    ) ||
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 299-300

```js
    catalog.campuses.some(
      (entry) =>
```

- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 301-304

```js
        !entry ||
        typeof entry.institution !== "string" ||
        typeof entry.campus !== "string" ||
        typeof entry.town !== "string" ||
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 305-308

```js
        !catalog.regions.some(
          (regionEntry) =>
            regionEntry.name === entry.region &&
            regionEntry.towns.includes(entry.town),
```

- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 309-312

```js
        ),
    )
  )
    throw new Error("Ghana location directory is incomplete or invalid.");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This stops the normal path and sends out an error message.

### Lines 313-316

```js
  TOWN_RECORDS = catalog.regions
    .flatMap((entry) =>
      entry.towns.map((name) => ({
        name,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 317-320

```js
        region: entry.name,
        key: locationKey(name),
      })),
    )
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 321-324

```js
    .sort(
      (a, b) => a.key.localeCompare(b.key) || a.region.localeCompare(b.region),
    );
  CAMPUS = Object.fromEntries(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 325-328

```js
    catalog.campuses.map((entry) => {
      const label = `${entry.institution} — ${entry.campus} (${entry.town}, ${entry.region} Region)`;
      return [label, { r: entry.region, t: entry.town, m: {} }];
    }),
```

- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 329-332

```js
  );
  populateTownOptions(town, region.value);
  populateTownOptions(commercialTown, commercialRegion.value);
  camp.innerHTML =
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.

### Lines 333-336

```js
    '<option value="">Choose your campus</option>' +
    Object.keys(CAMPUS)
      .map((name) => `<option>${htmlEsc(name)}</option>`)
      .join("");
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This sticks many pieces together into one bigger text.

### Lines 337-340

```js
  populateOwnerTownOptions($("f_town")?.value || "", $("f_region")?.value || "");
  $("location-status").hidden = true;
}
function ensureLocationCatalog() {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.
- This closes the piece of code that was opened just above.
- This starts a function named `ensureLocationCatalog`. It is a little recipe card the file can use later.

### Lines 341-344

```js
  if (!locationCatalogPromise) {
    locationCatalogPromise = loadLocationCatalog()
      .then(() => {
        $("location-status").hidden = true;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This chooses whether a page part should be hidden or shown.

### Lines 345-348

```js
      })
      .catch((error) => {
        locationCatalogPromise = null;
        console.error("Could not load Ghana location directory:", error);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 349-352

```js
        const status = $("location-status");
        status.textContent =
          "Town and campus lists could not be loaded. Please try again.";
        status.hidden = false;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.

### Lines 353-356

```js
        camp.innerHTML =
          '<option value="">Campus suggestions unavailable</option>';
        throw error;
      });
```

- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line is building HTML text, which is the page's visible structure.
- This stops the normal path and sends out an error message.
- This closes the piece of code that was opened just above.

### Lines 357-360

```js
  }
  return locationCatalogPromise;
}
function requestLocationCatalog() {
```

- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This starts a function named `requestLocationCatalog`. It is a little recipe card the file can use later.

### Lines 361-364

```js
  return ensureLocationCatalog().catch(() => {});
}
requestLocationCatalog();
const st = (r) =>
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a short helper function named `st`. It is a tiny shortcut recipe.

### Lines 365-368

```js
  r.un
    ? ["r", "Unavailable"]
    : r.availableFrom
      ? [
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 369-372

```js
          "y",
          "Available from " +
            new Date(r.availableFrom + "T00:00:00").toLocaleDateString(),
        ]
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 373-376

```js
      : r.d === 0
        ? ["g", "Confirmed today"]
        : r.d <= 7
          ? ["g", "Confirmed " + (r.d === 1 ? "1 day" : r.d + " days") + " ago"]
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 377-380

```js
          : r.d <= 20
            ? ["y", "Confirmed " + r.d + " days ago"]
            : ["w", "Needs confirmation"];
const rank = (r) => (r.un ? 3 : r.d > 20 ? 2 : r.d > 7 ? 1 : 0);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a short helper function named `rank`. It is a tiny shortcut recipe.

### Lines 381-384

```js
const has = (r, k) =>
  k === "Kitchen"
    ? r.f.includes("Kitchen") || r.ty === "chamber" || r.ty === "self"
    : k === "Security"
```

- This makes a short helper function named `has`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 385-388

```js
      ? r.f.includes("Security") || r.f.includes("Gated")
      : r.f.includes(k);
function match(r, a, t) {
  const m = parseInt(max.value, 10);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `match`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 389-392

```js
  return (
    (!region.value || r.region === region.value) &&
    (!t || r.t === t) &&
    (!a || r.a === a) &&
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 393-396

```js
    (!ty.value || r.ty === ty.value) &&
    (!m || r.p <= m) &&
    [...must].every((k) => has(r, k))
  );
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks whether all the items follow the rule.
- This closes the piece of code that was opened just above.

### Lines 397-400

```js
}
function fillAreas() {
  const areas = [
    ...new Set(
```

- This closes the piece of code that was opened just above.
- This starts a function named `fillAreas`. It is a little recipe card the file can use later.
- This starts an array named `areas`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 401-404

```js
      ROOMS.filter(
        (r) =>
          (!town.value || r.t === town.value) &&
          (!region.value || r.region === region.value),
```

- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 405-408

```js
      ).map((r) => r.a),
    ),
  ];
  area.innerHTML =
```

- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.

### Lines 409-412

```js
    '<option value="">All areas</option>' +
    areas.map((a) => `<option>${htmlEsc(a)}</option>`).join("");
}
function art(i) {
```

- This line is building HTML text, which is the page's visible structure.
- This walks through each item in a list and makes a new list from it.
- This closes the piece of code that was opened just above.
- This starts a function named `art`. It is a little recipe card the file can use later.

### Lines 413-414

```js
  const w = ["#E4D9C3", "#D3DCD5", "#DCD6E4", "#EBDCCB"][i % 4],
    b = ["#5B7A8C", "#8C6A5B", "#5B8C74", "#8C5B76"][i % 4];
```

- This starts an array named `w`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 415-415

```js
  return `<svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="170" fill="${w}"/><rect y="128" width="400" height="42" fill="#0000001c"/><rect x="40" y="30" width="86" height="80" rx="3" fill="#BFD8E8"/><path d="M83 30v80M40 70h86" stroke="#fff" stroke-width="4"/><rect x="170" y="78" width="190" height="50" rx="6" fill="${b}"/><rect x="170" y="62" width="34" height="30" rx="6" fill="#fff"/><rect x="170" y="128" width="8" height="14" fill="#5a4a3a"/><rect x="352" y="128" width="8" height="14" fill="#5a4a3a"/><rect x="336" y="96" width="4" height="34" fill="#444"/><path d="M328 96h20l-4-14h-12z" fill="#F6D58A"/></svg>`;
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 416-419

```js
}
const btns = (r) =>
  `<a class="wa" href="https://wa.me/${encodeURIComponent(r.wa || r.c)}?text=${encodeURIComponent("Hello, is the room on NestGH (" + r.n + ") still available?")}">WhatsApp</a><a class="call" href="tel:+${encodeURIComponent(r.c)}" aria-label="Call">${ico("phone")}</a>`;
function card(r, cm) {
```

- This closes the piece of code that was opened just above.
- This makes a short helper function named `btns`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.
- This starts a function named `card`. It is a little recipe card the file can use later.

### Lines 420-423

```js
  const i = ROOMS.indexOf(r),
    [k, l] = st(r),
    mn = cm && cm.m[r.a];
  return `<article class="card${r.un ? " off" : ""}" data-o="${i}"><div class="pic">${r.photos?.[0] ? `<img src="${htmlEsc(r.photos[0])}" alt="${htmlEsc(r.n)}" width="400" height="170" loading="lazy" decoding="async">` : art(i)}<span class="ty">${htmlEsc(TYPE[r.ty])}</span><button class="hb" data-i="${i}" aria-label="${saved.has(r.id) ? "Remove from" : "Save"} saved rooms" aria-pressed="${saved.has(r.id)}">${ico("heart")}</button></div><div class="b"><h3><button class="lk" data-o="${i}">${htmlEsc(r.n)}</button></h3><div class="loc">${ico("pin")}${htmlEsc(r.a)}, ${htmlEsc(r.t)}${mn ? " · " + mn + " min from campus" : ""}</div><div class="fac">${r.f.map((x) => `<span>${htmlEsc(x)}</span>`).join("")}</div><div class="meta"><span class="st"><i class="${k}"></i>${l}</span>${r.v ? " · <b>✔ Verified</b>" : ""}</div><div class="ft"><div class="pr">${ghs(r.p)} <small>/month</small></div><div class="acts">${r.un ? '<span class="gone">Taken</span>' : btns(r)}</div></div></div></article>`;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 424-427

```js
}
function nearby() {
  const a = area.value;
  if (!a)
```

- This closes the piece of code that was opened just above.
- This starts a function named `nearby`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 428-428

```js
    return `<div class="empty"><b>No rooms found in ${htmlEsc(town.value)}</b><p>Try a higher budget, another room type, or fewer must-haves.</p></div>`;
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 429-432

```js
  const c = (NB[town.value + "|" + a] || [])
    .map(([na, nt, km, lo, hi]) => ({
      na,
      nt,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 433-436

```js
      km,
      lo,
      hi,
      n: ROOMS.filter((r) => !r.un && match(r, na, nt)).length,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.

### Lines 437-440

```js
    }))
    .filter((x) => x.n)
    .sort((x, y) => x.lo + x.hi - (y.lo + y.hi) || x.km - y.km);
  return `<div class="empty near"><b>No rooms found in ${htmlEsc(a)}.</b><p>${c.length ? "Try these nearby areas. Travel times are estimates and change with traffic." : "No matching rooms nearby either. Try a higher budget or another room type."}</p><div class="nl">${c.map((x) => `<button class="nb" data-t="${htmlEsc(x.nt)}" data-a="${htmlEsc(x.na)}"><b>${htmlEsc(x.na)}</b><span>${x.n} room${x.n > 1 ? "s" : ""} · usually ${x.lo}–${x.hi} min away · ${x.km} km</span></button>`).join("")}</div></div>`;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 441-444

```js
}
function render() {
  const cm = stu.checked && camp.value ? CAMPUS[camp.value] : null;
  const res = (browseCategory === "houses"
```

- This closes the piece of code that was opened just above.
- This starts a function named `render`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 445-448

```js
    ? []
    : ROOMS.filter((r) =>
        savedOnly ? saved.has(r.id) : match(r, area.value, town.value),
      )
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 449-450

```js
  ).sort(
    (a, b) =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 451-454

```js
      rank(a) - rank(b) ||
      (cm
        ? (a.ty === "hostel" ? 0 : 1) - (b.ty === "hostel" ? 0 : 1) ||
          (cm.m[a.a] || 99) - (cm.m[b.a] || 99)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 455-458

```js
        : 0) ||
      a.d - b.d,
  );
  const live = res.filter((r) => !r.un).length;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This keeps only the items that match the rule.

### Lines 459-462

```js
  $("re").textContent = savedOnly
    ? "Your saved rooms"
    : browseCategory === "houses"
      ? "Family homes and apartments"
```

- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 463-466

```js
      : "Rooms in " +
      ([region.value && `${region.value} Region`, area.value || town.value]
        .filter(Boolean)
        .join(" · ") || "Ghana");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This sticks many pieces together into one bigger text.

### Lines 467-470

```js
  $("rt").textContent = savedOnly
    ? live
      ? `${live} saved room${live > 1 ? "s" : ""}`
      : "No saved rooms yet"
```

- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 471-474

```js
    : browseCategory === "houses"
      ? "Houses & apartments"
      : ROOMS.length
      ? live
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 475-478

```js
        ? `${live} room${live > 1 ? "s" : ""} available`
        : "No rooms found"
      : "";
  $("list").setAttribute("aria-busy", String(isLoadingListings));
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 479-482

```js
  const emptyMessage = live
    ? ""
    : browseCategory === "houses"
      ? '<div class="empty"><b>House listings are not available yet.</b><p>Browse rooms or check back when house listings are available.</p></div>'
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 483-486

```js
    : savedOnly
      ? '<div class="empty"><b>No saved rooms yet</b><p>Tap the heart on a room to save it here.</p></div>'
      : hasMoreListings
        ? `<div class="empty"><b>No matching rooms in the listings loaded so far.</b><p>Load more rooms to continue your search.</p></div>`
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 487-490

```js
        : nearby();
  const loadError = listingLoadFailed
    ? '<div class="empty"><b>Could not load more rooms.</b><p>Check your connection, then try again.</p></div>'
    : "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 491-494

```js
  $("list").innerHTML =
    loadError + emptyMessage + res.map((r) => card(r, cm)).join("");
  const loadMore = $("load-more");
  loadMore.hidden =
```

- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.

### Lines 495-498

```js
    (!hasMoreListings && !listingLoadFailed) || savedOnly || !supabaseClient;
  loadMore.disabled = isLoadingListings;
  loadMore.textContent = isLoadingListings
    ? "Loading rooms…"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 499-502

```js
    : listingLoadFailed
      ? "Try loading rooms again"
      : town.value ||
          region.value ||
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 503-506

```js
          area.value ||
          ty.value ||
          max.value ||
          must.size
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 507-510

```js
        ? "Load more to find matches"
        : "Load more rooms";
}
function openSheet(i) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This starts a function named `openSheet`. It is a little recipe card the file can use later.

### Lines 511-514

```js
  const   r = ROOMS[i],
  d = r.details || {},
  m = d.m || {},
  D = DEF[r.ty],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 515-518

```js
  monthlyRent = r.p,
    estimatedMoveIn =
      monthlyRent * (Number(r.adv) || 0) +
      (Number(r.dep) || 0) +
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 519-522

```js
      (Number(r.fee) || 0) +
      (Number(d.oth) || 0),
    description = String(d.description || d.desc || "").trim(),
    status = r.un
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This tidies text by cutting off extra spaces at the ends.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 523-526

```js
      ? "Unavailable"
      : r.availableFrom
        ? `Available from ${r.availableFrom}`
        : d.avail === "Yes, available now"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 527-530

```js
          ? "Available now"
          : d.avail === "No, available from a later date"
            ? "Available from a later date"
            : d.avail || "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 531-534

```js
  const kv = (o) =>
    `<div class="kv">${Object.entries(o)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .map(
```

- This makes a short helper function named `kv`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.
- This keeps only the items that match the rule.
- This walks through each item in a list and makes a new list from it.

### Lines 535-538

```js
        ([a, b]) => `<div><span>${htmlEsc(a)}</span><b>${htmlEsc(b)}</b></div>`,
      )
      .join("")}</div>`;
  const tg = (a, c = "") =>
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.
- This makes a short helper function named `tg`. It is a tiny shortcut recipe.

### Lines 539-539

```js
    `<div class="tags ${c}">${a.map((x) => `<span>${htmlEsc(x)}</span>`).join("") || "<span>None</span>"}</div>`;
```

- This walks through each item in a list and makes a new list from it.

### Lines 540-543

```js
  const included = Object.entries(m)
    .filter(([, v]) => ["Included", "Private", "Shared"].includes(v))
    .map(([a, b]) => `${a.replace(/^(inc_|fac_)/, "")}: ${b}`);
  const separate = Object.entries(m)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 544-547

```js
    .filter(([, v]) =>
      ["Separate Charge", "Not Included", "Extra Charge"].includes(v),
    )
    .map(([a, b]) => `${a.replace(/^(inc_|fac_)/, "")}: ${b}`);
```

- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.

### Lines 548-551

```js
  const photos = r.photos
    .map(
      (photo, index) =>
        `<img src="${htmlEsc(photo)}" alt="${htmlEsc(r.n)} photo ${index + 1}" width="400" height="300" loading="lazy" decoding="async">`,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 552-555

```js
    )
    .join("");
  const pl = d.period === "Other" ? d.periodOther : d.period || "Monthly";
  const otherCost = Number(d.oth) || 0;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 556-559

```js
  const extras = [
    d.othNote ? `${d.othNote}: ${ghs(otherCost)}` : "",
    d.notinc,
  ].filter(Boolean);
```

- This starts an array named `extras`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.

### Lines 560-569

```js
  const rules = {
    "Who can stay": Array.isArray(d.who) ? d.who.join(", ") : "",
    "Maximum occupants": d.maxOcc,
    Cooking: d.cooking,
    Visitors: d.visitors,
    Pets: d.pets,
    Smoking: d.smoking,
    Curfew: d.curfew === "Curfew applies" ? d.curfewTime : d.curfew,
    Noise: d.noise,
  };
```

- This starts an object named `rules`. An object is like a labeled cubby shelf where each label points to some data.
- This sticks many pieces together into one bigger text.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 570-577

```js
  const roomFacts = {
    Type: d.type || TYPE[r.ty],
    ...(d.beds ? { Bedrooms: d.beds } : {}),
    ...(d.bath ? { Bathroom: d.bath } : D.bath ? { Bathroom: D.bath } : {}),
    ...(d.size ? { Size: d.size } : D.size ? { Size: D.size } : {}),
    ...(d.furn ? { Furnished: d.furn } : {}),
    ...(status ? { Availability: status } : {}),
  };
```

- This starts an object named `roomFacts`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 578-581

```js
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.a + " " + r.t + " Ghana")}`;
  const featureList = [...new Set([...included, ...r.f])];
  const availableRules = Object.fromEntries(
    Object.entries(rules).filter(([, value]) => value !== null && value !== undefined && value !== ""),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts an array named `featureList`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.

### Lines 582-585

```js
  );
  const ownerContact = btns(r).replace(">WhatsApp</a>", ">Contact Owner</a>");
  $("sheet").innerHTML =
    `<div class="sp property-details" role="dialog" aria-modal="true" aria-label="${htmlEsc(`Property details: ${r.n}`)}">
```

- This closes the piece of code that was opened just above.
- This swaps one bit of text for another.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line is building HTML text, which is the page's visible structure.

### Lines 586-589

```js
      <button class="x" id="cx" aria-label="Close">Close ✕</button>
      <header class="property-details-heading"><span class="property-details-mark">${ico("user")}</span><div><h2>Property Details</h2><p>Everything you need to know before you contact.</p></div></header>
      <section class="property-summary">
        <div class="property-summary-image">${photos ? `<img src="${htmlEsc(r.photos[0])}" alt="${htmlEsc(r.n)}" width="400" height="300" decoding="async">` : art(i)}${r.photos.length > 1 ? `<span class="property-photo-count">${r.photos.length} photos</span>` : ""}</div>
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 590-593

```js
        <div class="property-summary-copy">
          <span class="property-kind">${htmlEsc(d.type || TYPE[r.ty])}</span>
          <h3 class="sn">${htmlEsc(r.n)}</h3>
          <p class="property-summary-location">${ico("pin")}${htmlEsc([r.t, r.a].filter(Boolean).join(" · "))}</p>
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This keeps only the items that match the rule.

### Lines 594-597

```js
          <p class="property-summary-rent">${ghs(monthlyRent)} <span>/month</span></p>
          ${estimatedMoveIn > 0 ? `<p class="property-move-in">Estimated move-in cost <b>${ghs(estimatedMoveIn)}</b></p>` : ""}
          <div class="property-quick-facts">${d.beds ? `<span>${ico("home")} ${htmlEsc(d.beds)} bed</span>` : ""}${d.bath || D.bath ? `<span>${ico("home")} ${htmlEsc(d.bath || D.bath)} bath</span>` : ""}${status ? `<span class="property-availability">${htmlEsc(status)}</span>` : ""}</div>
          ${r.v ? '<span class="property-verified">NestGH verified</span>' : ""}
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 598-600

```js
        </div>
      </section>
      <div class="property-tabs" role="tablist" aria-label="Property information">
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 601-601

```js
        <button type="button" class="property-tab is-active" id="property-tab-overview" role="tab" aria-selected="true" aria-controls="property-panel-overview" data-property-tab="overview">Overview</button>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 602-602

```js
        <button type="button" class="property-tab" id="property-tab-facilities" role="tab" aria-selected="false" aria-controls="property-panel-facilities" data-property-tab="facilities">Facilities</button>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 603-603

```js
        <button type="button" class="property-tab" id="property-tab-rules" role="tab" aria-selected="false" aria-controls="property-panel-rules" data-property-tab="rules">Rules</button>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 604-604

```js
        <button type="button" class="property-tab" id="property-tab-location" role="tab" aria-selected="false" aria-controls="property-panel-location" data-property-tab="location">Location</button>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 605-608

```js
      </div>
      <section class="property-panel" id="property-panel-overview" role="tabpanel" aria-labelledby="property-tab-overview" data-property-panel="overview">
        ${description ? `<h4>Description</h4><p class="property-description">${htmlEsc(description)}</p>` : ""}
        <h4>Property details</h4>${kv(roomFacts)}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 609-609

```js
        <h4>Price details</h4>${kv({ Rent: `${ghs(r.rentAmount ?? monthlyRent)} / ${pl}`, ...(r.adv ? { Advance: `${r.adv} payment(s) upfront` } : {}), ...(r.dep ? { "Security deposit": ghs(r.dep) } : {}), ...(r.fee ? { "Agency or caretaker fee": ghs(r.fee) } : {}), ...(otherCost ? { "Other mandatory charges": ghs(otherCost) } : {}) })}
```

- This line is building HTML text, which is the page's visible structure.

### Lines 610-613

```js
        ${estimatedMoveIn > 0 ? `<div class="tot"><span>Estimated move-in cost</span><b>${ghs(estimatedMoveIn)}</b></div>` : ""}
      </section>
      <section class="property-panel" id="property-panel-facilities" role="tabpanel" aria-labelledby="property-tab-facilities" data-property-panel="facilities" hidden>
        ${featureList.length ? `<h4>Property features</h4>${tg(featureList)}` : ""}
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 614-617

```js
        ${separate.length || extras.length ? `<h4>Paid separately</h4>${tg(separate.concat(extras), "sep")}` : ""}
        ${d.kit ? `<h4>Kitchen</h4><p class="property-description">${htmlEsc(d.kit)}</p>` : ""}
        ${d.cond ? `<h4>Condition</h4><p class="property-description">${htmlEsc(d.cond)}</p>` : ""}
        ${photos ? `<h4>Photos</h4><div class="listing-photos">${photos}</div>` : ""}
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 618-621

```js
      </section>
      <section class="property-panel" id="property-panel-rules" role="tabpanel" aria-labelledby="property-tab-rules" data-property-panel="rules" hidden>
        ${Object.keys(availableRules).length ? `<h4>Property rules</h4>${kv(availableRules)}` : '<p class="property-description">No rules have been provided.</p>'}
      </section>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 622-622

```js
      <section class="property-panel" id="property-panel-location" role="tabpanel" aria-labelledby="property-tab-location" data-property-panel="location" hidden>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 623-626

```js
        ${kv({ Town: r.t, Area: r.a, Landmark: r.lm })}
        <p class="np">The exact address is not shown publicly.</p>
        <a class="mp" target="_blank" rel="noopener" href="${mapUrl}">Open area in Maps</a>
        ${status ? `<h4>Availability</h4>${kv({ Status: status })}` : ""}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 627-630

```js
      </section>
      <section class="property-contact">
        <div><b>${htmlEsc(r.own || "Property owner")}</b><span>Contact the listing owner directly.</span></div>
        ${r.un ? '<span class="gone">Unavailable</span>' : `<div class="property-contact-actions">${ownerContact}</div>`}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 631-634

```js
      </section>
      <details class="property-report"><summary>Report this listing</summary><div class="rep"><select id="rr" aria-label="Reason"><option>Room already taken</option><option>Wrong price</option><option>Fake photos</option><option>Wrong location</option><option>Suspicious or scam</option><option>Owner not responding</option></select><button class="btn" id="rp" data-id="${htmlEsc(r.id)}">Report</button></div></details>
    </div>`;
  $("sheet").classList.add("on");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.

### Lines 635-638

```js
  updateModalScroll();
  {
    const sp = $("sheet").querySelector(".sp");
    sp.tabIndex = -1;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 639-642

```js
    sp.focus({ preventScroll: true });
  }
}
function closeSheet() {
```

- This puts the cursor or keyboard attention onto that page part.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This starts a function named `closeSheet`. It is a little recipe card the file can use later.

### Lines 643-646

```js
  $("sheet").classList.remove("on");
  updateModalScroll();
}
$("sheet").onclick = async (e) => {
```

- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 647-650

```js
  const propertyTab = e.target.closest("[data-property-tab]");
  if (propertyTab) {
    const sheet = $("sheet");
    const selected = propertyTab.dataset.propertyTab;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 651-654

```js
    sheet.querySelectorAll("[data-property-tab]").forEach((tab) => {
      const active = tab === propertyTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
```

- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This flips a CSS class on or off, like a light switch.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 655-658

```js
      tab.tabIndex = active ? 0 : -1;
    });
    sheet.querySelectorAll("[data-property-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.propertyPanel !== selected;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This goes through each item one by one and does the same kind of job for each.
- This chooses whether a page part should be hidden or shown.

### Lines 659-662

```js
    });
  }
  if (e.target.id === "sheet" || e.target.closest("#cx")) closeSheet();
  const report = e.target.closest("#rp");
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 663-666

```js
  if (report) {
    if (!supabaseClient) return toast("Reports are unavailable right now.");
    report.disabled = true;
    const { error } = await supabaseClient
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This waits for a slow job to finish before moving on.

### Lines 667-670

```js
      .from("listing_reports")
      .insert({ listing_id: report.dataset.id, reason: $("rr").value });
    if (error) {
      console.error("Could not submit listing report:", error);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 671-674

```js
      report.disabled = false;
      toast("Your report could not be sent. Please try again.");
    } else {
      toast("Thank you. Your report has been sent for review.");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 675-678

```js
      report.textContent = "Reported";
    }
  }
};
```

- This changes the plain text shown on the page.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 679-682

```js
document.onkeydown = (e) => {
  if (e.key === "Escape") {
    closeSheet();
    $("links").classList.remove("open");
```

- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This removes a CSS class, like taking a label off a page part.

### Lines 683-686

```js
    $("mn").setAttribute("aria-expanded", "false");
  }
};
$("list").onclick = (e) => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 687-690

```js
  const nb = e.target.closest(".nb");
  if (nb) {
    const place =
      TOWN_RECORDS.find(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 691-694

```js
        (item) => item.name === nb.dataset.t && item.region === region.value,
      ) || TOWN_RECORDS.find((item) => item.name === nb.dataset.t);
    if (place) chooseTown(place);
    else town.value = nb.dataset.t;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This is the fallback path: if the earlier rule was not true, do this instead.

### Lines 695-698

```js
    fillAreas();
    area.value = nb.dataset.a;
    render();
    return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 699-702

```js
  }
  const hb = e.target.closest(".hb");
  if (hb) {
    const r = ROOMS[+hb.dataset.i];
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 703-706

```js
    saved.has(r.id) ? saved.delete(r.id) : saved.add(r.id);
    try {
      localStorage.setItem("nestgh_saved_rooms_v1", JSON.stringify([...saved]));
    } catch (error) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This packs data into JSON text so it can be saved or sent.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 707-710

```js
      console.error("Could not save room preference:", error);
    }
    render();
    return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 711-714

```js
  }
  if (e.target.closest("a")) return;
  const c = e.target.closest(".card");
  if (c) openSheet(+c.dataset.o);
```

- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 715-718

```js
};
town.addEventListener("change", () => {
  area.value = "";
  fillAreas();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 719-722

```js
  render();
});
region.onchange = () => {
  populateTownOptions(town, region.value);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 723-726

```js
  area.value = "";
  fillAreas();
  render();
};
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 727-730

```js
town.onchange = () => {
  area.value = "";
  fillAreas();
  render();
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 731-734

```js
};
commercialRegion.onchange = () => {
  populateTownOptions(commercialTown, commercialRegion.value);
};
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 735-738

```js
document.querySelectorAll(".mh").forEach(
  (b) =>
    (b.onclick = () => {
      const k = b.dataset.k;
```

- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 739-742

```js
      must.has(k) ? must.delete(k) : must.add(k);
      b.setAttribute("aria-pressed", must.has(k));
      render();
    }),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 743-746

```js
);
stu.onchange = () => {
  camp.classList.toggle("open", stu.checked);
  if (!stu.checked) camp.value = "";
```

- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This flips a CSS class on or off, like a light switch.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 747-750

```js
  else requestLocationCatalog();
  render();
};
camp.onchange = () => {
```

- This is the fallback path: if the earlier rule was not true, do this instead.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 751-754

```js
  if (camp.value) {
    const selected = CAMPUS[camp.value];
    region.value = selected.r;
    populateTownOptions(town, selected.r, selected.t);
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 755-758

```js
    area.value = "";
    fillAreas();
  }
  render();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 759-762

```js
};
[area, ty].forEach((e) => (e.onchange = render));
let maxTimer;
max.oninput = () => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 763-766

```js
  clearTimeout(maxTimer);
  maxTimer = setTimeout(render, 200);
};
$("clr").onclick = () => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 767-770

```js
  region.value = "";
  populateTownOptions(town, "");
  ty.value = "";
  max.value = "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 771-774

```js
  area.value = "";
  must.clear();
  document
    .querySelectorAll(".mh")
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 775-778

```js
    .forEach((b) => b.setAttribute("aria-pressed", "false"));
  stu.checked = false;
  camp.value = "";
  camp.classList.remove("open");
```

- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This removes a CSS class, like taking a label off a page part.

### Lines 779-782

```js
  browseCategory = "";
  fillAreas();
  render();
};
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 783-786

```js
$("form").onsubmit = (e) => {
  e.preventDefault();
  render();
  $("rooms").scrollIntoView({
```

- This opens a new block of work. The lines underneath belong to this idea.
- This stops the browser from doing its usual action so this file can do a custom one instead.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This moves the view so the person can see the important part.

### Lines 787-790

```js
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
      ? "auto"
      : "smooth",
  });
```

- This asks the browser about a user setting, like whether motion should be reduced.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 791-794

```js
};
function toast(t) {
  const e = $("toast");
  e.textContent = t;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `toast`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.

### Lines 795-798

```js
  e.classList.add("on");
  setTimeout(() => e.classList.remove("on"), 2400);
}
["l1", "l2"].forEach((i) => ($(i).onclick = openLF));
```

- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.
- This removes a CSS class, like taking a label off a page part.
- This closes the piece of code that was opened just above.
- This goes through each item one by one and does the same kind of job for each.

### Lines 799-802

```js
document.querySelectorAll(".category-card").forEach((link) => {
  link.addEventListener("click", () => {
    if (link.dataset.roomType !== undefined) {
      browseCategory = "";
```

- This goes through each item one by one and does the same kind of job for each.
- This tells the page to listen for something happening and then run code when it happens.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 803-806

```js
      ty.value = link.dataset.roomType;
      render();
    }
    if (link.dataset.commercialType) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 807-810

```js
      const form = $("commercial-filters");
      form.reset();
      populateTownOptions(commercialTown, "");
      $("commercial-type").value = link.dataset.commercialType;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 811-814

```js
      commercial.filters = window.NestGHCommercial.readFilters(form);
      loadCommercialListings({ reset: true });
    }
    if (link.dataset.category === "houses") {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 815-818

```js
      browseCategory = "houses";
      ty.value = "";
      render();
    }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 819-822

```js
  });
});
$("sv").onclick = () => {
  savedOnly = !savedOnly;
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 823-826

```js
  $("sv").setAttribute("aria-pressed", savedOnly);
  $("mobile-saved").setAttribute("aria-pressed", String(savedOnly));
  $("sv").setAttribute(
    "aria-label",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 827-830

```js
    savedOnly ? "Show all rooms" : "Show saved rooms",
  );
  $("mobile-saved").setAttribute(
    "aria-label",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 831-834

```js
    savedOnly ? "Show all rooms" : "Show saved rooms",
  );
  render();
  $("rooms").scrollIntoView({
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This moves the view so the person can see the important part.

### Lines 835-838

```js
    behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
      ? "auto"
      : "smooth",
  });
```

- This asks the browser about a user setting, like whether motion should be reduced.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 839-842

```js
};
$("mobile-saved").onclick = () => $("sv").click();
$("mobile-more").onclick = () => $("mn").click();
$("mn").onclick = () => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 843-846

```js
  const open = $("links").classList.toggle("open");
  $("mn").setAttribute("aria-expanded", String(open));
  $("mobile-more").setAttribute("aria-expanded", String(open));
};
```

- This flips a CSS class on or off, like a light switch.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 847-850

```js
$("links").onclick = (e) => {
  if (e.target.closest("a")) {
    $("links").classList.remove("open");
    $("mn").setAttribute("aria-expanded", "false");
```

- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 851-854

```js
    $("mobile-more").setAttribute("aria-expanded", "false");
  }
};
fillAreas();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 855-858

```js
render();
async function loadListingFee() {
  if (!supabaseClient) throw new Error("Supabase is not configured.");
  const { data, error } = await supabaseClient
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `loadListingFee`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This waits for a slow job to finish before moving on.

### Lines 859-862

```js
    .from("public_site_settings")
    .select("listing_fee_pesewas, currency")
    .single();
  if (error) throw error;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 863-866

```js
  const fee = Number(data?.listing_fee_pesewas);
  if (!Number.isSafeInteger(fee) || fee <= 0 || data?.currency !== "GHS")
    throw new Error("Listing fee settings are invalid.");
  listingFeePesewas = fee;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This stops the normal path and sends out an error message.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 867-870

```js
}
async function refreshListingFee() {
  try {
    await loadListingFee();
```

- This closes the piece of code that was opened just above.
- This starts a function named `refreshListingFee`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This opens a new block of work. The lines underneath belong to this idea.
- This waits for a slow job to finish before moving on.

### Lines 871-874

```js
  } catch (error) {
    console.warn("Could not load current listing fee:", error);
    listingFeePesewas = null;
  }
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 875-878

```js
}
refreshListingFee();
function mapPublicListing(row) {
  const d = row.public_data || {},
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `mapPublicListing`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 879-882

```js
    m = d.m || {},
    type = d.type || "";
  const ty = /hostel/i.test(type)
    ? "hostel"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 883-886

```js
    : /self-contained/i.test(type)
      ? "self"
      : /chamber/i.test(type)
        ? "chamber"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 887-890

```js
        : "single";
  const facilities = Object.entries(m)
    .filter(([, v]) => ["Included", "Private", "Shared"].includes(v))
    .map(([k]) => k.replace(/^(inc_|fac_)/, ""));
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This walks through each item in a list and makes a new list from it.

### Lines 891-894

```js
  if (d.feat) facilities.push(d.feat);
  if (d.facOther) facilities.push(d.facOther);
  const phone = String(d.phone || "")
    .replace(/\D/g, "")
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This swaps one bit of text for another.

### Lines 895-898

```js
    .replace(/^0/, "233");
  const whatsapp = String(d.wa || d.phone || "")
    .replace(/\D/g, "")
    .replace(/^0/, "233");
```

- This swaps one bit of text for another.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This swaps one bit of text for another.
- This swaps one bit of text for another.

### Lines 899-900

```js
  const confirmedAt = Date.parse(d.confirmed_at || row.created_at || "");
  const confirmedDays = Number.isFinite(confirmedAt)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 901-904

```js
    ? Math.max(0, Math.floor((Date.now() - confirmedAt) / 86400000))
    : 0;
  const periodMonths = {
    "3 Months": 3,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts an object named `periodMonths`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 905-908

```js
    "6 Months": 6,
    Yearly: 12,
    Semester: 6,
  };
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 909-912

```js
  const rentAmount = Number(d.rent) || 0,
    period = String(d.period || "Monthly");
  return {
    id: row.id,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 913-916

```js
    t: String(d.town || ""),
    region: String(d.region || ""),
    a: String(d.area || ""),
    ty,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 917-920

```js
    n: String(d.title || "Room listing"),
    p: rentAmount / (periodMonths[period] || 1),
    rentAmount,
    period,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 921-924

```js
    f: [...new Set(facilities)],
    v: Boolean(d.verified),
    d: confirmedDays,
    adv: Number(d.adv) || 0,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 925-928

```js
    dep: Number(d.dep) || 0,
    fee: Number(d.fee) || 0,
    lm: String(d.lm || ""),
    c: phone,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 929-932

```js
    wa: whatsapp,
    own: String(d.role || "Property owner"),
    un: row.status === "unavailable",
    availableFrom:
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 933-936

```js
      d.avail === "No, available from a later date" ? String(d.from || "") : "",
    photos: Array.isArray(d.photos)
      ? d.photos.filter(
          (photo) => typeof photo === "string" && photo.startsWith("https://"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 937-940

```js
        )
      : [],
    details: d,
  };
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 941-944

```js
}
function commercialSkeletons() {
  return Array.from(
    { length: 3 },
```

- This closes the piece of code that was opened just above.
- This starts a function named `commercialSkeletons`. It is a little recipe card the file can use later.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 945-948

```js
    () =>
      '<article class="commercial-card commercial-skeleton" aria-hidden="true"><div class="commercial-image skel"></div><div class="skeleton-body"><span class="skel skeleton-title"></span><span class="skel skeleton-location"></span><span class="skel skeleton-price"></span></div></article>',
  ).join("");
}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This sticks many pieces together into one bigger text.
- This closes the piece of code that was opened just above.

### Lines 949-952

```js
function renderCommercialListings() {
  const list = $("commercial-list");
  list.innerHTML =
    commercial.loading && !commercial.listings.length
```

- This starts a function named `renderCommercialListings`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 953-956

```js
      ? commercialSkeletons()
      : commercial.listings
          .map((listing) =>
            window.NestGHCommercial.renderCard(listing, {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 957-960

```js
              saved: saved.has(listing.id),
              icon: ico("home"),
              saveIcon: ico("heart"),
            }),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 961-964

```js
          )
          .join("");
  list.setAttribute("aria-busy", String(commercial.loading));
  $("commercial-load-more").hidden = !commercial.hasMore || commercial.loading;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.

### Lines 965-968

```js
  $("commercial-load-more").disabled = commercial.loading;
}
function commercialContactLink(listing) {
  const number = String(listing.whatsapp || listing.phone || "").replace(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This starts a function named `commercialContactLink`. It is a little recipe card the file can use later.
- This swaps one bit of text for another.

### Lines 969-972

```js
    /[^\d+]/g,
    "",
  );
  const digits = number.replace(/\D/g, "").replace(/^0/, "233");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This swaps one bit of text for another.

### Lines 973-976

```js
  if (!/^\d{7,15}$/.test(digits)) return null;
  const url = new URL(window.location.href);
  url.searchParams.set("space", listing.id);
  url.hash = "shops-spaces";
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This builds or checks a web address in a careful way.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 977-980

```js
  const message = `Hello, I'm interested in ${listing.title} on NestGH: ${url.toString()}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
function commercialCallLink(listing) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This starts a function named `commercialCallLink`. It is a little recipe card the file can use later.

### Lines 981-984

```js
  const number = String(listing.phone || "").replace(/[^\d+]/g, "");
  return /^\+?\d{7,15}$/.test(number) ? `tel:${number}` : null;
}
function openCommercialDetails(id) {
```

- This swaps one bit of text for another.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This starts a function named `openCommercialDetails`. It is a little recipe card the file can use later.

### Lines 985-988

```js
  const listing = commercial.listings.find((item) => item.id === id);
  if (!listing) return;
  $("sheet").innerHTML = window.NestGHCommercial.renderDetails(listing, {
    icon: ico("home"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 989-992

```js
    interestUrl: commercialContactLink(listing),
    callUrl: commercialCallLink(listing),
  });
  $("sheet").classList.add("on");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.

### Lines 993-996

```js
  updateModalScroll();
  const dialog = $("sheet").querySelector(".commercial-detail");
  dialog.tabIndex = -1;
  dialog.focus({ preventScroll: true });
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This puts the cursor or keyboard attention onto that page part.

### Lines 997-1000

```js
}
function showCommercialError(message) {
  $("commercial-status").textContent = message;
  $("commercial-empty").hidden = true;
```

- This closes the piece of code that was opened just above.
- This starts a function named `showCommercialError`. It is a little recipe card the file can use later.
- This changes the plain text shown on the page.
- This chooses whether a page part should be hidden or shown.

### Lines 1001-1004

```js
  $("commercial-error").hidden = false;
  $("commercial-list").innerHTML = "";
  $("commercial-list").setAttribute("aria-busy", "false");
  $("commercial-load-more").hidden = true;
```

- This chooses whether a page part should be hidden or shown.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.

### Lines 1005-1008

```js
}
async function loadCommercialListings({ reset = false } = {}) {
  if (commercial.loading && !reset) return;
  const api = window.NestGHCommercial;
```

- This closes the piece of code that was opened just above.
- This starts a function named `loadCommercialListings`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1009-1012

```js
  if (!api) {
    showCommercialError("We couldn't load shops & spaces. Please try again.");
    console.error("The commercial listings frontend module did not load.");
    return;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1013-1016

```js
  }
  if (!supabaseClient) {
    showCommercialError("We couldn't load shops & spaces. Please try again.");
    console.error("Could not load shops & spaces: Supabase is not configured.");
```

- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1017-1019

```js
    return;
  }

```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 1020-1023

```js
  if (reset) {
    commercial.listings = [];
    commercial.offset = 0;
    commercial.hasMore = false;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1024-1027

```js
    commercial.requested = true;
  }
  const requestId = ++commercial.requestId;
  commercial.loading = true;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1028-1031

```js
  $("commercial-error").hidden = true;
  $("commercial-empty").hidden = true;
  $("commercial-status").textContent = "Loading shops & spaces...";
  if (reset) $("commercial-list").innerHTML = commercialSkeletons();
```

- This chooses whether a page part should be hidden or shown.
- This chooses whether a page part should be hidden or shown.
- This changes the plain text shown on the page.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1032-1033

```js
  renderCommercialListings();

```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 1034-1037

```js
  let result;
  try {
    result = await api.queryPage(
      supabaseClient,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This waits for a slow job to finish before moving on.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1038-1041

```js
      commercial.filters || api.readFilters($("commercial-filters")),
      commercial.offset,
    );
  } catch (error) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1042-1045

```js
    if (requestId !== commercial.requestId) return;
    commercial.loading = false;
    console.error("Could not load shops & spaces:", error);
    showCommercialError("We couldn't load shops & spaces. Please try again.");
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1046-1049

```js
    return;
  }
  if (requestId !== commercial.requestId) return;
  commercial.loading = false;
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1050-1050

```js
  if (result.error) {
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1051-1054

```js
    console.error("Could not load shops & spaces:", result.error);
    showCommercialError("We couldn't load shops & spaces. Please try again.");
    return;
  }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 1055-1058

```js

  const rows = Array.isArray(result.data) ? result.data : [];
  const listings = rows.map(api.normalize).filter(Boolean);
  if (listings.length !== rows.length) {
```

- This empty line is just a small breathing space so the code is easier to read.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1059-1062

```js
    console.warn("Some commercial listings were omitted because required fields were invalid.");
  }
  commercial.listings.push(...listings);
  commercial.offset += rows.length;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1063-1066

```js
  commercial.hasMore = rows.length === api.PAGE_SIZE;
  $("commercial-error").hidden = true;
  $("commercial-empty").hidden = commercial.listings.length > 0;
  $("commercial-status").textContent = commercial.listings.length
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.
- This chooses whether a page part should be hidden or shown.
- This changes the plain text shown on the page.

### Lines 1067-1070

```js
    ? `${commercial.listings.length} commercial listing${commercial.listings.length === 1 ? "" : "s"} loaded.`
    : "No shops or spaces available yet.";
  renderCommercialListings();
  syncCommercialSaveButtons();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1071-1074

```js

  const requestedId = new URL(window.location.href).searchParams.get("space");
  if (requestedId) openCommercialDetails(requestedId);
}
```

- This empty line is just a small breathing space so the code is easier to read.
- This builds or checks a web address in a careful way.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.

### Lines 1075-1078

```js
function syncCommercialSaveButtons() {
  document.querySelectorAll("[data-commercial-save]").forEach((button) => {
    const isSaved = saved.has(button.dataset.commercialSave);
    button.setAttribute("aria-pressed", String(isSaved));
```

- This starts a function named `syncCommercialSaveButtons`. It is a little recipe card the file can use later.
- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1079-1082

```js
    button.setAttribute("aria-label", isSaved ? "Remove saved space" : "Save space");
  });
}
function setupCommercialListings() {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This starts a function named `setupCommercialListings`. It is a little recipe card the file can use later.

### Lines 1083-1086

```js
  const api = window.NestGHCommercial;
  const form = $("commercial-filters");
  if (!api || !form) return;
  const typeSelect = $("commercial-type");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1087-1090

```js
  typeSelect.insertAdjacentHTML(
    "beforeend",
    api.TYPES.map(
      (type) =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1091-1091

```js
        `<option value="${htmlEsc(type)}">${htmlEsc(type)}</option>`,
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1092-1095

```js
    ).join(""),
  );
  commercial.filters = api.readFilters(form);
  const rangePairs = [
```

- This sticks many pieces together into one bigger text.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts an array named `rangePairs`. It is a built-in list the rest of the file will look up later.

### Lines 1096-1099

```js
    ["commercial-min-rent", "commercial-max-rent"],
    ["commercial-min-size", "commercial-max-size"],
  ];
  const validateCommercialRanges = () => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This makes a short helper function named `validateCommercialRanges`. It is a tiny shortcut recipe.

### Lines 1100-1103

```js
    let valid = true;
    rangePairs.forEach(([minimumId, maximumId]) => {
      const minimum = $(minimumId);
      const maximum = $(maximumId);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1104-1107

```js
      const invalid =
        minimum.value !== "" &&
        maximum.value !== "" &&
        Number(minimum.value) > Number(maximum.value);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1108-1111

```js
      minimum.setCustomValidity(
        invalid ? "The minimum cannot be greater than the maximum." : "",
      );
      maximum.setCustomValidity(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1112-1115

```js
        invalid ? "The maximum must be at least the minimum." : "",
      );
      if (invalid) valid = false;
    });
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.

### Lines 1116-1119

```js
    return valid;
  };
  rangePairs.flat().forEach((id) => {
    $(id).addEventListener("input", validateCommercialRanges);
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.
- This tells the page to listen for something happening and then run code when it happens.

### Lines 1120-1123

```js
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateCommercialRanges() || !form.reportValidity()) return;
```

- This closes the piece of code that was opened just above.
- This tells the page to listen for something happening and then run code when it happens.
- This stops the browser from doing its usual action so this file can do a custom one instead.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1124-1127

```js
    commercial.filters = api.readFilters(form);
    loadCommercialListings({ reset: true });
  });
  $("commercial-clear").addEventListener("click", () => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This tells the page to listen for something happening and then run code when it happens.

### Lines 1128-1131

```js
    form.reset();
      populateTownOptions(commercialTown, "");
      commercial.filters = api.readFilters(form);
    loadCommercialListings({ reset: true });
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1132-1135

```js
  });
  $("commercial-retry").addEventListener("click", () => {
    commercial.filters = api.readFilters(form);
    loadCommercialListings({ reset: true });
```

- This closes the piece of code that was opened just above.
- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1136-1139

```js
  });
  $("commercial-load-more").addEventListener("click", () => {
    loadCommercialListings();
  });
```

- This closes the piece of code that was opened just above.
- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 1140-1143

```js
  $("commercial-list").addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-commercial-save]");
    if (saveButton) {
      const id = saveButton.dataset.commercialSave;
```

- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1144-1147

```js
      saved.has(id) ? saved.delete(id) : saved.add(id);
      try {
        localStorage.setItem("nestgh_saved_rooms_v1", JSON.stringify([...saved]));
      } catch (error) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This packs data into JSON text so it can be saved or sent.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1148-1151

```js
        console.error("Could not save property preference:", error);
      }
      syncCommercialSaveButtons();
      return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1152-1155

```js
    }
    const detailsButton = event.target.closest("[data-commercial-details]");
    const cardElement = event.target.closest("[data-commercial-id]");
    if (event.target.closest("a")) return;
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1156-1159

```js
    if (detailsButton) {
      openCommercialDetails(detailsButton.dataset.commercialDetails);
    } else if (cardElement) {
      openCommercialDetails(cardElement.dataset.commercialId);
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1160-1163

```js
    }
  });
}
setupCommercialListings();
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1164-1167

```js
function maybeLoadCommercialListings() {
  if (
    window.location.hash === "#shops-spaces" &&
    !commercial.requested &&
```

- This starts a function named `maybeLoadCommercialListings`. It is a little recipe card the file can use later.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1168-1171

```js
    !commercial.loading
  ) {
    commercial.filters = window.NestGHCommercial.readFilters(
      $("commercial-filters"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1172-1175

```js
    );
    loadCommercialListings({ reset: true });
  }
}
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1176-1179

```js
window.addEventListener("hashchange", maybeLoadCommercialListings);
maybeLoadCommercialListings();
async function loadPublicListings() {
  const state = $("db-status");
```

- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `loadPublicListings`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1180-1183

```js
  if (isLoadingListings) return;
  if (!supabaseClient) {
    $("list").innerHTML =
      '<div class="empty"><b>Room listings are temporarily unavailable.</b><p>We could not connect to the listings service.</p></div>';
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line is building HTML text, which is the page's visible structure.

### Lines 1184-1187

```js
    $("list").setAttribute("aria-busy", "false");
    $("load-more").hidden = true;
    state.textContent =
      "Room listings are temporarily unavailable because the Supabase browser configuration could not load.";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1188-1191

```js
    return;
  }
  isLoadingListings = true;
  listingLoadFailed = false;
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1192-1195

```js
  state.textContent = listingOffset
    ? "Loading more rooms."
    : "Loading available rooms.";
  $("list").setAttribute("aria-busy", "true");
```

- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1196-1199

```js
  $("load-more").hidden = true;
  let data, error;
  try {
    ({ data, error } = await supabaseClient
```

- This chooses whether a page part should be hidden or shown.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This waits for a slow job to finish before moving on.

### Lines 1200-1200

```js
      .from("public_listings")
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1201-1204

```js
      .select("id,public_data,created_at")
      .eq("category", "ROOM")
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1205-1208

```js
      .range(listingOffset, listingOffset + LISTING_PAGE_SIZE - 1));
  } catch (requestError) {
    isLoadingListings = false;
    listingLoadFailed = true;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1209-1212

```js
    console.error("Could not request approved listings:", requestError);
    state.textContent = "We could not load rooms right now. Please try again.";
    render();
    return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1213-1216

```js
  }
  isLoadingListings = false;
  if (error) {
    listingLoadFailed = true;
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1217-1220

```js
    console.error("Could not load approved listings:", error);
    state.textContent = "We could not load rooms right now. Please try again.";
    render();
    return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1221-1224

```js
  }
  listingLoadFailed = false;
  const page = data || [];
  listingOffset += page.length;
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1225-1228

```js
  hasMoreListings = page.length === LISTING_PAGE_SIZE;
  const selectedArea = area.value;
  ROOMS.push(
    ...page
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1229-1232

```js
    .filter(
      (row) =>
        row.category !== "COMMERCIAL" &&
        row.public_data?.category !== "commercial",
```

- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1233-1236

```js
    )
    .map(mapPublicListing)
      .filter((room) => room.t && room.a && room.p > 0 && room.c),
  );
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This keeps only the items that match the rule.
- This closes the piece of code that was opened just above.

### Lines 1237-1240

```js
  fillAreas();
  if (
    selectedArea &&
    [...area.options].some((option) => option.value === selectedArea)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks whether at least one item in the list matches the rule.

### Lines 1241-1244

```js
  )
    area.value = selectedArea;
  state.textContent = ROOMS.length
    ? `${ROOMS.length} room${ROOMS.length === 1 ? "" : "s"} loaded${hasMoreListings ? ". Load more to continue browsing." : "."}`
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1245-1248

```js
    : "There are no approved rooms available at the moment.";
  render();
}
document
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1249-1252

```js
  .querySelector("#load-more")
  .addEventListener("click", loadPublicListings);
loadPublicListings();
async function verifyPaymentReturn() {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `verifyPaymentReturn`. It is a little recipe card the file can use later and it may pause while waiting for slow work.

### Lines 1253-1256

```js
  const url = new URL(window.location.href),
    reference = url.searchParams.get("payment_reference");
  if (!reference) return;
  url.searchParams.delete("payment_reference");
```

- This builds or checks a web address in a careful way.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1257-1260

```js
  history.replaceState(null, "", url.pathname + url.search + url.hash);
  if (!supabaseClient) {
    toast(
      "Payment returned, but payment verification is unavailable. Contact NestGH with reference " +
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1261-1264

```js
        reference +
        ".",
    );
    return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1265-1268

```js
  }
  const resultStatus = $("payment-return-status"),
    retryButton = $("retry-payment");
  let data, error;
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1269-1272

```js
  try {
    ({ data, error } = await supabaseClient.functions.invoke(
      "verify-listing-payment",
      { body: { reference } },
```

- This opens a new block of work. The lines underneath belong to this idea.
- This waits for a slow job to finish before moving on.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1273-1276

```js
    ));
  } catch (requestError) {
    error = requestError;
  }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 1277-1280

```js
  if (error || data?.error) {
    console.error("Listing payment verification failed:", error || data.error);
    resultStatus.textContent =
      "We could not verify payment yet. Do not pay again until you check the payment status. If Paystack marked the attempt failed or cancelled, you can retry. Reference: " +
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1281-1284

```js
      reference;
    resultStatus.hidden = false;
    retryButton.hidden = !getPendingSubmission(reference);
    toast("Payment verification is pending. Reference: " + reference);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.
- This chooses whether a page part should be hidden or shown.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1285-1288

```js
    return;
  }
  clearPendingSubmission();
  resultStatus.textContent =
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.

### Lines 1289-1292

```js
    "Payment verified. Your listing is now waiting for NestGH review.";
  resultStatus.hidden = false;
  toast("Payment verified. Your listing is now waiting for NestGH review.");
}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This chooses whether a page part should be hidden or shown.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 1293-1296

```js
verifyPaymentReturn();
function getPendingSubmission(reference) {
  try {
    const value = JSON.parse(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `getPendingSubmission`. It is a little recipe card the file can use later.
- This opens a new block of work. The lines underneath belong to this idea.
- This opens JSON text and turns it back into normal data the code can use.

### Lines 1297-1300

```js
      sessionStorage.getItem("nestgh_pending_payment") || "null",
    );
    return value?.reference === reference ? value : null;
  } catch (error) {
```

- This reads from or writes to the browser's tab-only notepad. `sessionStorage` is like a note on the desk that lasts only for the current browser tab session.
- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1301-1304

```js
    console.error("Could not read saved payment retry details:", error);
    return null;
  }
}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1305-1308

```js
function readPendingSubmission() {
  try {
    return JSON.parse(
      sessionStorage.getItem("nestgh_pending_payment") || "null",
```

- This starts a function named `readPendingSubmission`. It is a little recipe card the file can use later.
- This opens a new block of work. The lines underneath belong to this idea.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This reads from or writes to the browser's tab-only notepad.

### Lines 1309-1312

```js
    );
  } catch (error) {
    console.error("Could not read saved payment retry details:", error);
    return null;
```

- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1313-1316

```js
  }
}
function clearPendingSubmission() {
  try {
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This starts a function named `clearPendingSubmission`. It is a little recipe card the file can use later.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1317-1320

```js
    sessionStorage.removeItem("nestgh_pending_payment");
  } catch (error) {
    console.error("Could not clear saved payment retry details:", error);
  }
```

- This reads from or writes to the browser's tab-only notepad.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 1321-1324

```js
}
async function beginCheckout(form) {
  if (!Number.isSafeInteger(listingFeePesewas) || listingFeePesewas <= 0)
    throw new Error(
```

- This closes the piece of code that was opened just above.
- This starts a function named `beginCheckout`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This stops the normal path and sends out an error message.

### Lines 1325-1328

```js
      "The current listing fee could not be loaded. Please refresh and try again.",
    );
  form.set("expected_fee_pesewas", String(listingFeePesewas));
  const response = await fetch(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This asks for data from another place, like sending someone to the shop to bring something back.

### Lines 1329-1332

```js
    window.NESTGH_SUPABASE_CONFIG.url + "/functions/v1/start-listing-payment",
    {
      method: "POST",
      headers: { apikey: window.NESTGH_SUPABASE_CONFIG.publishableKey },
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1333-1336

```js
      body: form,
    },
  );
  const result = await response.json();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This waits for a slow job to finish before moving on.

### Lines 1337-1340

```js
  if (!response.ok || !result.authorization_url)
    throw new Error(result.error || "Secure checkout could not be started.");
  const checkout = new URL(result.authorization_url);
  if (
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This stops the normal path and sends out an error message.
- This builds or checks a web address in a careful way.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1341-1344

```js
    checkout.protocol !== "https:" ||
    (checkout.hostname !== "paystack.com" &&
      !checkout.hostname.endsWith(".paystack.com"))
  )
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1345-1348

```js
    throw new Error("The payment provider returned an invalid checkout link.");
  const submission = JSON.parse(form.get("listing"));
  try {
    sessionStorage.setItem(
```

- This stops the normal path and sends out an error message.
- This opens JSON text and turns it back into normal data the code can use.
- This opens a new block of work. The lines underneath belong to this idea.
- This reads from or writes to the browser's tab-only notepad.

### Lines 1349-1350

```js
      "nestgh_pending_payment",
      JSON.stringify({
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This packs data into JSON text so it can be saved or sent.

### Lines 1351-1354

```js
        submission_id: form.get("submission_id"),
        email: submission.email,
        reference: result.reference,
        expectedFeePesewas: listingFeePesewas,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1355-1358

```js
      }),
    );
  } catch (error) {
    console.error("Could not save payment retry details:", error);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1359-1362

```js
  }
  S.ref = result.reference;
  window.location.assign(checkout.toString());
}
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 1363-1366

```js
async function retrySecurePayment() {
  const pending = readPendingSubmission();
  if (!pending) {
    toast(
```

- This starts a function named `retrySecurePayment`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1367-1370

```js
      "Payment retry details are unavailable. Contact NestGH with your payment reference.",
    );
    return;
  }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 1371-1374

```js
  await refreshListingFee();
  if (listingFeePesewas === null) {
    $("payment-return-status").textContent =
      "The current listing fee could not be loaded. Please refresh the page before retrying.";
```

- This waits for a slow job to finish before moving on.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1375-1378

```js
    return;
  }
  if (pending.expectedFeePesewas !== listingFeePesewas) {
    pending.expectedFeePesewas = listingFeePesewas;
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1379-1382

```js
    try {
      sessionStorage.setItem("nestgh_pending_payment", JSON.stringify(pending));
    } catch (error) {
      console.error("Could not update saved listing fee for retry:", error);
```

- This opens a new block of work. The lines underneath belong to this idea.
- This packs data into JSON text so it can be saved or sent.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1383-1386

```js
    }
    $("payment-return-status").textContent =
      "The listing fee is now " +
      formatFeePesewas(listingFeePesewas) +
```

- This closes the piece of code that was opened just above.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1387-1390

```js
      ". Review the updated fee, then select the retry button again to continue.";
    $("retry-payment").textContent =
      "Retry at " + formatFeePesewas(listingFeePesewas);
    return;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1391-1394

```js
  }
  const listing = {
    submission_id: pending.submission_id,
    email: pending.email,
```

- This closes the piece of code that was opened just above.
- This starts an object named `listing`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1395-1398

```js
    title: "Previously submitted listing",
    town: "Pending",
    area: "Pending",
    rent: 1,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1399-1402

```js
    phone: "0240000000",
    cons: Array(6).fill(true),
  };
  const form = new FormData();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a `FormData` parcel so text and files can be sent together. `FormData` is a little parcel the browser uses to bundle form values and files together.

### Lines 1403-1406

```js
  form.append("submission_id", pending.submission_id);
  form.append("listing", JSON.stringify(listing));
  $("retry-payment").disabled = true;
  try {
```

- This adds a new item onto the end, like putting one more block onto a tower.
- This packs data into JSON text so it can be saved or sent.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1407-1410

```js
    await refreshListingFee();
    await beginCheckout(form);
  } catch (error) {
    console.error("Could not retry listing payment:", error);
```

- This waits for a slow job to finish before moving on.
- This waits for a slow job to finish before moving on.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1411-1414

```js
    toast(
      error instanceof Error
        ? error.message
        : "Secure checkout could not be started.",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1415-1418

```js
    );
    $("retry-payment").disabled = false;
  }
}
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1419-1422

```js
$("retry-payment").onclick = retrySecurePayment;
/* ===== LIST A ROOM ===== */
const esc = (s) =>
  String(s ?? "").replace(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This makes a short helper function named `esc`. It is a tiny shortcut recipe.
- This swaps one bit of text for another.

### Lines 1423-1426

```js
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const TYPES = [
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This closes the piece of code that was opened just above.
- This starts an array named `TYPES`. It is a built-in list the rest of the file will look up later.

### Lines 1427-1430

```js
    "Single Room",
    "Chamber & Hall",
    "Self-Contained",
    "1-in-a-Room",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1431-1434

```js
    "2-in-a-Room",
    "4-in-a-Room",
    "Student Hostel",
  ],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1435-1438

```js
  COMMERCIAL_TYPES = [
    "Shop",
    "Store",
    "Office",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1439-1442

```js
    "Showroom",
    "Warehouse",
    "Salon",
    "Restaurant",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1443-1446

```js
    "Commercial Space",
    "Other",
  ],
  CONDS = ["New", "Newly Renovated", "Good Condition", "Fair Condition"],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1447-1450

```js
  PERIODS = ["Monthly", "3 Months", "6 Months", "Yearly", "Semester", "Other"],
  INC = [
    "Water",
    "Electricity",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1451-1454

```js
    "Wi-Fi",
    "Kitchen",
    "Bathroom",
    "Wardrobe",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1455-1458

```js
    "Bed",
    "Mattress",
    "Parking",
    "Security",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1459-1462

```js
    "Cleaning",
  ],
  INCO = ["Included", "Not Included", "Shared", "Separate Charge"],
  FAC = [
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1463-1466

```js
    "Water",
    "Electricity",
    "Wi-Fi",
    "Kitchen",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1467-1470

```js
    "Bathroom",
    "Security",
    "Gated Compound",
    "Parking",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1471-1474

```js
    "Laundry Area",
    "Waste Disposal",
  ],
  FACO = ["Not available", "Private", "Shared", "Included", "Extra Charge"],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1475-1478

```js
  WHO = [
    "Students",
    "Workers",
    "Families",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1479-1482

```js
    "Couples",
    "Male",
    "Female",
    "Anyone",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1483-1486

```js
  ],
  PHC = [
    "Exterior",
    "Bedroom",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1487-1490

```js
    "Bathroom",
    "Kitchen",
    "Compound or common area",
  ],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1491-1494

```js
  COMMERCIAL_PHC = [
    "Exterior",
    "Interior",
    "Frontage",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1495-1498

```js
    "Facilities",
    "Surrounding area",
  ],
  EXC = ["Hall", "Wardrobe", "Parking", "Balcony", "Surrounding area", "Other"],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1499-1500

```js
  ROLES = [
    "Property Owner",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1501-1504

```js
    "Caretaker",
    "Hostel Manager",
    "Authorized Representative",
  ],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1505-1508

```js
  CONS = [
    "I confirm that I am authorized to list this property.",
    "The information I have provided is accurate.",
    "The property is genuinely available.",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1509-1512

```js
    "I understand that NestGH may contact me to confirm availability.",
    "I consent to my profile photo and relevant contact information being displayed to people viewing my listing.",
    "I understand that NestGH may reject or remove inaccurate, misleading or fraudulent listings.",
  ],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1513-1516

```js
  PL = {
    Monthly: "month",
    "3 Months": "3 months",
    "6 Months": "6 months",
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1517-1520

```js
    Yearly: "year",
    Semester: "semester",
  };
const S = { m: {}, ph: {}, extra: [], who: [], cons: [] };
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts an object named `S`. An object is like a labeled cubby shelf where each label points to some data.

### Lines 1521-1524

```js
let cur = 0,
  reach = 0;
const done = new Set();
const activeSteps = () =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This creates a Set named `done`. It stores unique items, like keeping only one copy of each sticker.
- This makes a short helper function named `activeSteps`. It is a tiny shortcut recipe.

### Lines 1525-1528

```js
  S.category === "commercial"
    ? STEPS.filter((_, index) => [0, 1, 2, 6, 7, 8, 9].includes(index))
    : STEPS;
const photoCategories = () =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a short helper function named `photoCategories`. It is a tiny shortcut recipe.

### Lines 1529-1532

```js
  S.category === "commercial" ? COMMERCIAL_PHC : PHC;
const today = () => {
  const d = new Date();
  return (
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a short helper function named `today`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1533-1536

```js
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1537-1540

```js
    String(d.getDate()).padStart(2, "0")
  );
};
const n = (k) => parseFloat(S[k]),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a short helper function named `n`. It is a tiny shortcut recipe.

### Lines 1541-1544

```js
  blank = (k) => !String(S[k] ?? "").trim(),
  okPhone = (v) =>
    /^(?:0|\+?233)[235]\d{8}$/.test(String(v || "").replace(/[\s-]/g, ""));
const F = (k, l, i, h = "") =>
```

- This tidies text by cutting off extra spaces at the ends.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This swaps one bit of text for another.
- This makes a short helper function named `F`. It is a tiny shortcut recipe.

### Lines 1545-1545

```js
  `<div class="fld" data-f="${k}"><label for="f_${k}">${l}</label>${i}${h ? `<small>${h}</small>` : ""}<em class="er" role="alert"></em></div>`;
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1546-1549

```js
const inp = (k, t = "text", a = "") =>
  `<input id="f_${k}" data-k="${k}" type="${t}" value="${esc(S[k])}" ${a}>`;
const sel = (k, o) =>
  `<select id="f_${k}" data-k="${k}"><option value="">Select</option>${o.map((x) => `<option${S[k] === x ? " selected" : ""}>${x}</option>`).join("")}</select>`;
```

- This makes a short helper function named `inp`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.
- This makes a short helper function named `sel`. It is a tiny shortcut recipe.
- This walks through each item in a list and makes a new list from it.

### Lines 1550-1553

```js
const categorySelect = () =>
  `<select id="f_category" data-k="category"><option value="">Select</option><option value="rooms"${S.category === "rooms" ? " selected" : ""}>Rooms &amp; Hostels</option><option value="commercial"${S.category === "commercial" ? " selected" : ""}>Shops &amp; Spaces to Let</option></select>`;
const txt = (k, r, ph = "") =>
  `<textarea id="f_${k}" data-k="${k}" rows="${r}" placeholder="${ph}">${esc(S[k])}</textarea>`;
```

- This makes a short helper function named `categorySelect`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.
- This makes a short helper function named `txt`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.

### Lines 1554-1557

```js
const rad = (k, o) =>
  `<div class="rg" role="radiogroup">${o.map((x) => `<label class="ch"><input type="radio" name="${k}" data-k="${k}" value="${x}"${S[k] === x ? " checked" : ""}><span>${x}</span></label>`).join("")}</div>`;
const chk = (k, o) =>
  `<div class="rg">${o.map((x) => `<label class="ch"><input type="checkbox" data-c="${k}" value="${x}"${(S[k] || []).includes(x) ? " checked" : ""}><span>${x}</span></label>`).join("")}</div>`;
```

- This makes a short helper function named `rad`. It is a tiny shortcut recipe.
- This walks through each item in a list and makes a new list from it.
- This makes a short helper function named `chk`. It is a tiny shortcut recipe.
- This walks through each item in a list and makes a new list from it.

### Lines 1558-1561

```js
const mrow = (k, l, o) =>
  `<div class="mx" data-f="${k}"><span>${l}</span><select data-m="${k}" aria-label="${l}"><option value="">Select</option>${o.map((x) => `<option${S.m[k] === x ? " selected" : ""}>${x}</option>`).join("")}</select><em class="er"></em></div>`;
const bd = () => {
  const r = n("rent") || 0,
```

- This makes a short helper function named `mrow`. It is a tiny shortcut recipe.
- This walks through each item in a list and makes a new list from it.
- This makes a short helper function named `bd`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1562-1565

```js
    a = n("adv") || 0,
    d = n("dep") || 0,
    f = n("fee") || 0,
    o = n("oth") || 0,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1566-1569

```js
    advance = S.category === "commercial" ? n("advanceAmount") || 0 : r * a,
    pl =
      S.period === "Other"
        ? S.periodOther || "period"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1570-1573

```js
        : PL[S.period] || "period";
  return `<div class="tot2"><div><span>Rent</span><b>${ghs(r)} / ${esc(pl)}</b></div><div><span>Advance</span><b>${ghs(advance)}</b></div><div><span>Security deposit</span><b>${ghs(d)}</b></div><div><span>Agency or caretaker fee</span><b>${ghs(f)}</b></div><div><span>Other mandatory charges</span><b>${ghs(o)}</b></div><div class="g"><span>Estimated amount required to move in</span><b>${ghs(advance + d + f + o)}</b></div></div>`;
};
const slot = (c) =>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a short helper function named `slot`. It is a tiny shortcut recipe.

### Lines 1574-1574

```js
  `<div class="ps" data-f="ph_${c}"><b>${c}</b><div class="pv">${S.ph[c] ? `<img src="${S.ph[c]}" alt="${c} photo">` : "No photo yet"}</div><div class="pa"><label class="btn2 up">${S.ph[c] ? "Replace" : "Upload"}<input type="file" accept="image/jpeg,image/png,image/webp" data-ph="${c}"></label>${S.ph[c] ? `<button type="button" class="btn2" data-rm="${c}">Remove</button>` : ""}</div><em class="er"></em></div>`;
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1575-1578

```js
const xl = () =>
  S.extra
    .map(
      (x, i) =>
```

- This makes a short helper function named `xl`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1579-1579

```js
        `<div class="xr"><img src="${x.src}" alt="Extra photo ${i + 1}"><select data-xc="${i}" aria-label="Photo category">${EXC.map((o) => `<option${x.cat === o ? " selected" : ""}>${o}</option>`).join("")}</select><div><button type="button" class="btn2" data-xu="${i}" aria-label="Move up">↑</button><button type="button" class="btn2" data-xd="${i}" aria-label="Move down">↓</button><button type="button" class="btn2" data-xr="${i}">Remove</button></div></div>`,
```

- This walks through each item in a list and makes a new list from it.

### Lines 1580-1583

```js
    )
    .join("");
const KV = (o) =>
  `<div class="kv">${Object.entries(o)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.
- This makes a short helper function named `KV`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.

### Lines 1584-1587

```js
    .map(([a, b]) => `<div><span>${a}</span><b>${esc(b)}</b></div>`)
    .join("")}</div>`;
const sec = (t, i, h) =>
  `<section class="rv"><div class="rh"><b>${t}</b><button type="button" class="ed" data-go="${activeSteps().indexOf(STEPS[i])}">Edit</button></div>${h}</section>`;
```

- This walks through each item in a list and makes a new list from it.
- This sticks many pieces together into one bigger text.
- This makes a short helper function named `sec`. It is a tiny shortcut recipe.
- This line is building HTML text, which is the page's visible structure.

### Lines 1588-1591

```js
const tags = (a) =>
  `<div class="vs">${a.map((x) => `<span>${esc(x)}</span>`).join("")}</div>`;
const VAGUE = /^(nice|good|great|clean)?\s*room[.!]*$|^call me[.!]*$/i,
  MAPRE =
```

- This makes a short helper function named `tags`. It is a tiny shortcut recipe.
- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1592-1595

```js
    /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.)/i;
const STEPS = [
  {
    n: "Property",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts an array named `STEPS`. It is a built-in list the rest of the file will look up later.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1596-1599

```js
    r: () => !S.category
      ? `<h2>Choose a listing type</h2><p class="sub2">Start by choosing what kind of property you want to list.</p>${F("category", "Property category", categorySelect())}`
      : S.category === "commercial"
      ? `<h2>Shop or space details</h2><p class="sub2">List a business property to rent with accurate details for prospective tenants.</p>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 1600-1603

```js
${F("category", "What are you listing?", categorySelect())}
${F("title", "Listing title", inp("title", "text", 'maxlength="80" placeholder="Describe the commercial property"'))}
${F("type", "Business space type", sel("type", COMMERCIAL_TYPES))}
${S.type === "Other" ? F("otherType", "Describe the space type", inp("otherType", "text", 'maxlength="60" placeholder="Describe the property type"')) : ""}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1604-1607

```js
${F("cond", "Property condition", sel("cond", CONDS))}
${F("units", "Number of spaces available", inp("units", "number", 'min="1" inputmode="numeric"'))}
${F("size", "Approximate floor area (m²)", inp("size", "number", 'min="1" step="0.1" inputmode="decimal"'))}
<h3>Space features</h3>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1608-1611

```js
${F("roadVisibility", "Visible from the road?", rad("roadVisibility", ["Yes", "No"]))}
${F("parking", "Parking available?", rad("parking", ["Yes", "No"]))}
${F("electricity", "Electricity available?", rad("electricity", ["Yes", "No"]))}
${F("water", "Water available?", rad("water", ["Yes", "No"]))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1612-1612

```js
${F("desc", "Space description", txt("desc", 5, "Describe the space, its condition, location, facilities and anything a tenant should know."), 'Describe the property accurately. Write at least 100 characters. <span id="cc"></span>')}`
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1613-1616

```js
      : `<h2>Room information</h2><p class="sub2">What are you listing? Tell seekers exactly what they will get.</p>
${F("category", "What are you listing?", categorySelect())}
${F("title", "Listing title", inp("title", "text", 'maxlength="80" placeholder="e.g. Self-contained room near Community 20 market"'))}
${F("type", "Accommodation type", sel("type", TYPES))}${F("cond", "Property condition", sel("cond", CONDS))}
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1617-1620

```js
${F("furn", "Furnished or unfurnished", rad("furn", ["Furnished", "Unfurnished"]))}
${F("units", "Number of rooms or units available", inp("units", "number", 'min="1" inputmode="numeric"'))}
${F("desc", "Room description", txt("desc", 5, "Describe the room, its condition, location, facilities and anything a tenant should know."), 'Describe the room, its condition, location, facilities and anything a tenant should know. Not just "Nice room". <span id="cc"></span>')}
<h3>Room details</h3>${F("beds", "Number of bedrooms", inp("beds", "number", 'min="0" inputmode="numeric"'))}${F("bath", "Bathroom type", rad("bath", ["Private", "Shared", "None"]))}${F("kit", "Kitchen type", rad("kit", ["Private", "Shared", "None"]))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 1621-1621

```js
${F("size", "Approximate room size", inp("size", "text", 'placeholder="e.g. 12 m² or 4 m x 5 m"'))}${F("floor", "Floor level", sel("floor", ["Ground floor", "1st floor", "2nd floor", "3rd floor", "4th floor or higher"]))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1622-1622

```js
${F("store", "Wardrobe or storage", sel("store", ["Built-in wardrobe", "Space for a wardrobe", "No storage"]))}${F("balc", "Balcony", rad("balc", ["Yes", "No"]))}${F("feat", "Other important features (optional)", inp("feat"))}`,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1623-1626

```js
    v: () => {
      const e = {},
        d = (S.desc || "").trim();
      if (!S.category)
```

- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This tidies text by cutting off extra spaces at the ends.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1627-1630

```js
        return { category: "Please choose what kind of property you want to list." };
      if ((S.title || "").trim().length < 8)
        e.title = "Please enter a listing title (at least 8 characters).";
      if (S.category === "commercial") {
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1631-1634

```js
        if (!COMMERCIAL_TYPES.includes(S.type))
          e.type = "Please select the business space type.";
        if (S.type === "Other" && blank("otherType"))
          e.otherType = "Please describe the business space type.";
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1635-1638

```js
        if (!S.cond) e.cond = "Please select the property condition.";
        if (!(n("units") >= 1))
          e.units = "Please enter how many spaces are available.";
        if (!(n("size") > 0))
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1639-1642

```js
          e.size = "Please enter the approximate floor area in square metres.";
        if (d.length < 100 || d.split(/\s+/).length < 15 || VAGUE.test(d))
          e.desc = "Please describe the space in at least 100 characters (about 15 words).";
        ["roadVisibility", "parking", "electricity", "water"].forEach((key) => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.

### Lines 1643-1646

```js
          if (!S[key]) e[key] = "Please select Yes or No.";
        });
        return e;
      }
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 1647-1650

```js
      if (!S.type) e.type = "Please select the room type.";
      if (!S.cond) e.cond = "Please select the property condition.";
      if (!S.furn) e.furn = "Please choose furnished or unfurnished.";
      if (!(n("units") >= 1))
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1651-1654

```js
        e.units = "Please enter how many rooms or units are available.";
      if (d.length < 100 || d.split(/\s+/).length < 15 || VAGUE.test(d))
        e.desc =
          "Please describe the room properly. Write at least 100 characters (about 15 words).";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1655-1658

```js
      if (blank("beds") || n("beds") < 0)
        e.beds = "Please enter the number of bedrooms (0 if none).";
      if (!S.bath) e.bath = "Please choose the bathroom type.";
      if (!S.kit) e.kit = "Please choose the kitchen type.";
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1659-1662

```js
      if (blank("size")) e.size = "Please enter the approximate room size.";
      if (!S.floor) e.floor = "Please select the floor level.";
      if (!S.store) e.store = "Please select wardrobe or storage.";
      if (!S.balc) e.balc = "Please say whether there is a balcony.";
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1663-1666

```js
      return e;
    },
  },
  {
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1667-1670

```js
    n: "Location",
    r: () => `<h2>Location</h2><p class="sub2">Seekers see the area and landmark. Your exact address stays private.</p>
${F("region", "Region", sel("region", REGIONS))}${F("town", "Town or city", inp("town", "text", 'list="tl" autocomplete="off" placeholder="Choose a region first"'))}<datalist id="tl"></datalist>
${F("area", "Area or community", inp("area", "text", 'placeholder="e.g. Community 20"'))}${F("lm", "Nearest landmark", inp("lm", "text", 'placeholder="e.g. Community 20 Market"'))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1671-1671

```js
${F("addr", "Exact address or directions (private: only NestGH admin sees this)", txt("addr", 3, "House number, street name, or directions to the house"))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1672-1672

```js
<div class="fld" data-f="map"><label>Map location</label><button type="button" class="btn2" id="gps">Use my current location</button><div class="or">or paste a Google Maps link to the property</div>${inp("mapLink", "url", 'placeholder="https://maps.app.goo.gl/..."')}<small id="mapst">${S.lat ? "Location saved: " + S.lat + ", " + S.lng : "Standing at the property helps. In Google Maps, press and hold to drop a pin, tap Share, and paste the link here."}</small><a class="mp" target="_blank" rel="noopener" href="https://www.google.com/maps">Open Google Maps</a><em class="er"></em></div>`,
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1673-1676

```js
    v: () => {
      const e = {};
      if (!S.region) e.region = "Please select the region.";
      if (blank("town")) e.town = "Please enter the town or city.";
```

- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1677-1680

```js
      else if (
        !TOWN_RECORDS.some(
          (place) =>
            place.region === S.region && place.key === locationKey(S.town),
```

- This is the next rule to try if the earlier rule did not win.
- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1681-1684

```js
        )
      )
        e.town = "Choose a town listed under the selected region.";
      if (blank("area")) e.area = "Please enter the area or community.";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1685-1688

```js
      if (blank("lm")) e.lm = "Please enter the nearest landmark.";
      if ((S.addr || "").trim().length < 5)
        e.addr =
          "Please enter the exact address or directions (only admin sees this).";
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1689-1692

```js
      if (!(S.lat && S.lng) && !MAPRE.test((S.mapLink || "").trim()))
        e.map =
          "Please provide the map location: use your current location or paste a Google Maps link.";
      return e;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1693-1696

```js
    },
  },
  {
    n: "Costs",
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1697-1700

```js
    r: () => `<h2>Price and costs</h2><p class="sub2">Show every mandatory charge. Nothing hidden.</p>
${F("rent", S.category === "commercial" ? "Monthly rent (GH₵)" : "Rent amount (GH₵)", inp("rent", "number", 'min="1" inputmode="decimal"'))}${S.category === "commercial" ? '<p class="sub2">Commercial spaces are listed with monthly rent.</p>' : `${F("period", "Payment period", sel("period", PERIODS))}<div id="po" hidden>${F("periodOther", "Describe the payment period", inp("periodOther", "text", 'placeholder="e.g. every 2 months"'))}</div>`}
${S.category === "commercial" ? F("advanceAmount", "Advance payment (GH₵, enter 0 if none)", inp("advanceAmount", "number", 'min="0" step="0.01" inputmode="decimal"')) : F("adv", "Advance required (number of payments upfront)", inp("adv", "number", 'min="0" step="1" inputmode="numeric"'), "Example: monthly rent with 12 means one year in advance. Enter 0 if none.")}
${F("dep", "Security deposit (GH₵, enter 0 if none)", inp("dep", "number", 'min="0" inputmode="decimal"'))}${F("fee", "Agency or caretaker fee (GH₵, enter 0 if none)", inp("fee", "number", 'min="0" inputmode="decimal"'))}
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1701-1701

```js
${F("oth", "Other mandatory charges (GH₵, enter 0 if none)", inp("oth", "number", 'min="0" inputmode="decimal"'))}<div id="on" hidden>${F("othNote", "Describe the other charges", inp("othNote"))}</div>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1702-1705

```js
<h3>What the seeker sees</h3><div id="bd"></div>`,
    v: () => {
      const e = {};
      if (!(n("rent") > 0)) e.rent = "Please enter the rent amount.";
```

- This line is building HTML text, which is the page's visible structure.
- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1706-1709

```js
      if (S.category === "commercial") {
        if (blank("advanceAmount") || !(n("advanceAmount") >= 0))
          e.advanceAmount = "Please enter the advance amount (0 if none).";
      } else {
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 1710-1713

```js
        if (!S.period) e.period = "Please select the payment period.";
        if (S.period === "Other" && blank("periodOther"))
          e.periodOther = "Please describe the payment period.";
        if (blank("adv") || !(n("adv") >= 0) || n("adv") % 1)
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1714-1717

```js
          e.adv = "Please enter the advance as a whole number (0 if none).";
      }
      [
        "dep:security deposit",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1718-1721

```js
        "fee:agency or caretaker fee",
        "oth:other mandatory charges",
      ].forEach((x) => {
        const [k, l] = x.split(":");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1722-1725

```js
        if (blank(k) || !(n(k) >= 0))
          e[k] = "Please enter the " + l + " (0 if none).";
      });
      if (n("oth") > 0 && blank("othNote"))
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1726-1729

```js
        e.othNote = "Please describe the other charges.";
      return e;
    },
  },
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1730-1733

```js
  {
    n: "Included",
    r: () => `<h2>What is included</h2><p class="sub2">For each item, say what the tenant gets.</p>${INC.map((i) => mrow("inc_" + i, i, INCO)).join("")}
<div class="mx"><input type="text" data-k="incOther" placeholder="Other item (optional)" aria-label="Other item" value="${esc(S.incOther)}"><select data-m="inc_Other" aria-label="Other item status"><option value="">Select</option>${INCO.map((x) => `<option${S.m.inc_Other === x ? " selected" : ""}>${x}</option>`).join("")}</select></div>
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This walks through each item in a list and makes a new list from it.

### Lines 1734-1734

```js
<h3>What is NOT included?</h3>${F("notinc", "What will the tenant pay for separately, or not get?", txt("notinc", 4, "e.g. Electricity is prepaid. Cleaning is GH₵30 a month. No Wi-Fi."), "Required. Be clear so tenants are not surprised.")}
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1735-1735

```js
<label class="ch line"><input type="checkbox" data-k="nothingSep"${S.nothingSep ? " checked" : ""}><span>The tenant pays nothing separately. Everything needed is included.</span></label>`,
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1736-1739

```js
    v: () => {
      const e = {};
      INC.forEach((i) => {
        if (!S.m["inc_" + i]) e["inc_" + i] = "Please choose an option.";
```

- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This goes through each item one by one and does the same kind of job for each.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1740-1743

```js
      });
      const sep = INC.some((i) =>
        ["Not Included", "Separate Charge"].includes(S.m["inc_" + i]),
      );
```

- This closes the piece of code that was opened just above.
- This checks whether at least one item in the list matches the rule.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 1744-1747

```js
      if (S.nothingSep && sep)
        e.notinc =
          "You marked some items as not included or separate. Please list them here instead of ticking the box.";
      else if (!S.nothingSep && (S.notinc || "").trim().length < 10)
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This is the next rule to try if the earlier rule did not win.

### Lines 1748-1751

```js
        e.notinc = "Please explain what is NOT included.";
      return e;
    },
  },
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1752-1755

```js
  {
    n: "Facilities",
    r: () =>
      `<h2>Facilities</h2><p class="sub2">Choose an option for every facility.</p>${FAC.map((i) => mrow("fac_" + i, i, FACO)).join("")}<div class="fld" style="margin-top:16px">${`<label for="f_facOther">Other facilities (optional)</label>` + inp("facOther")}</div>`,
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.

### Lines 1756-1759

```js
    v: () => {
      const e = {};
      FAC.forEach((i) => {
        if (!S.m["fac_" + i]) e["fac_" + i] = "Please choose an option.";
```

- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This goes through each item one by one and does the same kind of job for each.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1760-1763

```js
      });
      return e;
    },
  },
```

- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1764-1767

```js
  {
    n: "Rules",
    r: () => `<h2>Rules</h2><p class="sub2">Say the rules now, so tenants know before they contact you.</p>
${F("who", "Who can stay? (choose all that apply)", chk("who", WHO))}${F("maxOcc", "Maximum occupants", inp("maxOcc", "number", 'min="1" inputmode="numeric"'))}
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1768-1768

```js
${F("cooking", "Cooking allowed?", rad("cooking", ["Allowed", "Not allowed", "Shared kitchen only"]))}${F("visitors", "Visitors allowed?", rad("visitors", ["Allowed", "Not allowed", "Daytime only"]))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1769-1769

```js
${F("pets", "Pets allowed?", rad("pets", ["Allowed", "Not allowed"]))}${F("smoking", "Smoking allowed?", rad("smoking", ["Allowed", "Not allowed"]))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1770-1770

```js
${F("curfew", "Curfew?", rad("curfew", ["No curfew", "Curfew applies"]))}<div id="ct" hidden>${F("curfewTime", "Curfew time", inp("curfewTime", "time"))}</div>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1771-1771

```js
${F("noise", "Noise restrictions", sel("noise", ["No restrictions", "Quiet after 10 pm", "Quiet all day (study-friendly)", "Other (explain below)"]))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1772-1775

```js
${F("otherRules", "Other rules (optional)", txt("otherRules", 6, "Any other house rules tenants must follow"))}`,
    v: () => {
      const e = {};
      if (!S.who.length) e.who = "Please choose who can stay.";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1776-1779

```js
      if (!(n("maxOcc") >= 1))
        e.maxOcc = "Please enter the maximum number of occupants.";
      [
        "cooking:cooking",
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1780-1783

```js
        "visitors:visitors",
        "pets:pets",
        "smoking:smoking",
        "curfew:curfew",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1784-1787

```js
      ].forEach((x) => {
        const [k, l] = x.split(":");
        if (!S[k]) e[k] = "Please choose an option for " + l + ".";
      });
```

- This goes through each item one by one and does the same kind of job for each.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.

### Lines 1788-1791

```js
      if (S.curfew === "Curfew applies" && blank("curfewTime"))
        e.curfewTime = "Please enter the curfew time.";
      if (!S.noise) e.noise = "Please select the noise rule.";
      return e;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1792-1795

```js
    },
  },
  {
    n: "Availability",
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1796-1796

```js
    r: () => `<h2>Availability</h2><p class="sub2">The date you submit is recorded automatically. Seekers see it as "Confirmed today" or "Confirmed 3 days ago".</p>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1797-1797

```js
${F("avail", S.category === "commercial" ? "Is the space currently available?" : "Is the room currently available?", rad("avail", ["Yes, available now", "No, available from a later date"]))}${F("from", "Available from", inp("from", "date"))}${F("aunits", S.category === "commercial" ? "Number of spaces currently available" : "Number of units currently available", inp("aunits", "number", 'min="1" inputmode="numeric"'))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1798-1800

```js
<div class="warn">You do not pay again to keep your listing live. If the property is rented, you or NestGH can mark it Unavailable.</div>`,
    v: () => {
      const e = {},
```

- This line is building HTML text, which is the page's visible structure.
- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.

### Lines 1801-1804

```js
        t = today();
      if (!S.avail)
        e.avail = "Please say whether the property is currently available.";
      if (blank("from")) e.from = "Please enter the date it is available from.";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1805-1808

```js
      else if (S.avail && S.avail.startsWith("Yes") && S.from > t)
        e.from = "If it is available now, the date cannot be in the future.";
      else if (S.avail && S.avail.startsWith("No") && S.from <= t)
        e.from = "Please choose a future date for when it will be available.";
```

- This is the next rule to try if the earlier rule did not win.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This is the next rule to try if the earlier rule did not win.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1809-1812

```js
      if (!(n("aunits") >= 1))
        e.aunits = "Please enter the number of units currently available.";
      else if (n("units") >= 1 && n("aunits") > n("units"))
        e.aunits =
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This is the next rule to try if the earlier rule did not win.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1813-1816

```js
          "This cannot be more than the units you entered in step 1 (" +
          S.units +
          ").";
      return e;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1817-1820

```js
    },
  },
  {
    n: "Photos",
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1821-1821

```js
    r: () => `<h2>Photos</h2><p class="sub2">Upload one clear photo for each category below. JPG, PNG or WebP images are accepted.</p><div class="pg">${photoCategories().map(slot).join("")}</div><div class="fld" data-f="photos"><em class="er"></em></div>
```

- This walks through each item in a list and makes a new list from it.

### Lines 1822-1822

```js
<h3>More photos (optional)</h3><label class="btn2 up">Add more photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-xph></label><div id="xl" style="margin-top:10px">${xl()}</div><small class="sub2">JPG, PNG or WebP. Photos are resized before upload. Use the arrows to reorder extra photos.</small>`,
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1823-1826

```js
    v: () => {
      const e = {},
        miss = photoCategories().filter((c) => !S.ph[c]);
      miss.forEach(
```

- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This keeps only the items that match the rule.
- This goes through each item one by one and does the same kind of job for each.

### Lines 1827-1830

```js
        (c) => (e["ph_" + c] = "Please upload a photo for: " + c + "."),
      );
      if (miss.length)
        e.photos =
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1831-1834

```js
          "Please upload at least 5 photos. Still needed: " +
          miss.join(", ") +
          ".";
      return e;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 1835-1838

```js
    },
  },
  {
    n: "Contact",
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1839-1842

```js
    r: () => `<h2>Owner or caretaker</h2><p class="sub2">Tenants want to know who they are dealing with.</p>
<div class="fld" data-f="profile"><label>Profile photo</label><div class="av">${S.profile ? `<img src="${S.profile}" alt="Your profile photo">` : "No photo"}</div><label class="btn2 up">${S.profile ? "Replace photo" : "Upload a clear photo of your face"}<input type="file" accept="image/jpeg,image/png,image/webp" data-pf></label><small>Your profile photo may be displayed to people viewing this listing so they know who they are contacting.</small><em class="er"></em></div>
${F("name", "Full name", inp("name", "text", 'autocomplete="name"'))}${F("phone", "Phone number", inp("phone", "tel", 'autocomplete="tel" placeholder="e.g. 024 000 0000"'))}
${F("email", "Email address", inp("email", "email", 'autocomplete="email" placeholder="you@example.com"'))}
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1843-1843

```js
${F("wa", "WhatsApp number", inp("wa", "tel", 'placeholder="e.g. 024 000 0000"'), '<label class="ch line" style="margin:6px 0 0"><input type="checkbox" data-k="waSame"' + (S.waSame ? " checked" : "") + "><span>Same as my phone number</span></label>")}
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1844-1844

```js
${F("role", "Your role", sel("role", ROLES))}${F("rel", "Relationship to the property", inp("rel", "text", 'placeholder="e.g. I own the building, or I manage it for the owner"'))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1845-1845

```js
<div class="vs"><span>Phone: not verified yet</span><span>Identity: not verified yet</span><span>Property: not verified yet</span></div><small class="sub2">Paying does not make you verified. NestGH only marks Phone, Identity or Property as verified after checking. We never show identity documents publicly.</small>`,
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1846-1849

```js
    v: () => {
      const e = {};
      if (!S.profile) e.profile = "Please upload a clear profile photo.";
      if ((S.name || "").trim().length < 3)
```

- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1850-1853

```js
        e.name = "Please enter your full name.";
      if (!okPhone(S.phone))
        e.phone = "Please enter a valid Ghana phone number, like 024 000 0000.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.email || ""))
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1854-1857

```js
        e.email = "Please enter a valid email address for the payment receipt.";
      if (!okPhone(S.wa)) e.wa = "Please enter a valid WhatsApp number.";
      if (!S.role) e.role = "Please select your role.";
      if ((S.rel || "").trim().length < 3)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1858-1861

```js
        e.rel = "Please describe your relationship to the property.";
      return e;
    },
  },
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1862-1865

```js
  {
    n: "Review",
    r: () => {
      const al = [...photoCategories().map((c) => S.ph[c]), ...S.extra.map((x) => x.src)].filter(
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This starts an array named `al`. It is a built-in list the rest of the file will look up later.

### Lines 1866-1869

```js
          Boolean,
        );
      const fail = S.payMsg
        ? `<div class="warn fail" role="alert">${S.payMsg}</div>`
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 1870-1873

```js
        : "";
      const feeNotice = S.feeChanged
        ? '<div class="warn" role="status">The listing fee changed while you were preparing this submission. Review the updated amount, then submit again.</div>'
        : "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1874-1877

```js
      if (S.category === "commercial") {
        const publicType = S.type === "Other" ? S.otherType : S.type;
        return `<h2>Review and pay</h2><p class="sub2">Check everything. This is what seekers will see once NestGH approves your listing.</p>${feeNotice}${fail}
${sec("Shop or space", 0, KV({ Title: S.title, Type: publicType, Condition: S.cond, "Spaces available": S.units, "Floor area": `${S.size} m²`, "Road visibility": S.roadVisibility, Parking: S.parking, Electricity: S.electricity, Water: S.water }) + `<p class="np">${esc(S.desc)}</p>`)}
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line is building HTML text, which is the page's visible structure.

### Lines 1878-1878

```js
${sec("Location", 1, KV({ Region: S.region, "Town or city": S.town, Area: S.area, "Nearest landmark": S.lm, Map: S.lat ? "Saved from GPS" : "Google Maps link" }) + `<p class="np">Public: area and landmark only. Your exact address is private to NestGH admin.</p>`)}
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1879-1882

```js
${sec("Price and costs", 2, bd())}
${sec("Availability", 6, KV({ Available: S.avail, "Available from": S.from, "Spaces available": S.aunits, Confirmed: "Today (recorded automatically when you submit)" }))}
${sec("Photos", 7, `<div class="rvp">${al.map((s) => `<img src="${s}" alt="Listing photo">`).join("")}</div>`)}
${sec("Owner or representative", 8, `<div style="display:flex;gap:12px;align-items:center"><div class="av" style="margin:0;border-style:solid"><img src="${S.profile}" alt="Profile photo"></div><div><b>${esc(S.name)}</b><div class="np" style="margin:0">${esc(S.role)}. ${esc(S.rel)}</div></div></div>` + KV({ "Shown to seekers": "Profile photo, name, role, WhatsApp and Call buttons", Phone: S.phone, WhatsApp: S.wa }) + `<div class="vs"><span>Phone: not verified yet</span><span>Identity: not verified yet</span><span>Property: not verified yet</span></div>`)}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This line is building HTML text, which is the page's visible structure.

### Lines 1883-1883

```js
<div class="warn">CHECK YOUR INFORMATION CAREFULLY</div><div class="fld" data-f="consent"><label class="ch line"><input type="checkbox" data-k="accurate"${S.accurate ? " checked" : ""}><span>I confirm that all information is accurate.</span></label>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1884-1884

```js
${CONS.map((c, i) => `<label class="ch line"><input type="checkbox" data-cons="${i}"${S.cons[i] ? " checked" : ""}><span>${c}</span></label>`).join("")}<em class="er"></em></div>
```

- This walks through each item in a list and makes a new list from it.

### Lines 1885-1885

```js
<p class="pv2"><b>Privacy notice.</b> NestGH uses what you submit to review and publish your listing, contact you about availability, and prevent fraud. Your profile photo, name, role and contact buttons may be shown to people viewing your listing. Your exact address is only seen by NestGH admin, and identity documents are never shown publicly. You can ask to see, correct or delete your information under Ghana's Data Protection Act, 2012 (Act 843). Read our full <a href="#" data-pol="privacy">Privacy Policy</a>, <a href="#" data-pol="cookie">Cookie Policy</a> and <a href="#" data-pol="terms">Terms and Conditions</a>.</p>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1886-1886

```js
<div class="tot"><span>Standard listing (one-time)</span><b>${listingFeePesewas === null ? "Unavailable" : formatFeePesewas(listingFeePesewas)}</b></div>${listingFeePesewas === null ? '<p class="warn" role="alert">The current listing fee could not be loaded. Payment is unavailable until the site reconnects to its settings.</p>' : ""}<p class="pv2">There is one package only. Payment does not approve or verify your listing. NestGH reviews every listing first.</p>`;
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1887-1890

```js
      }
      return `<h2>Review and pay</h2><p class="sub2">Check everything. This is what seekers will see once NestGH approves your listing.</p>${feeNotice}${fail}
${sec("Room", 0, KV({ Title: S.title, Type: S.type, Condition: S.cond, Furnished: S.furn, "Units available": S.units, Bedrooms: S.beds, Bathroom: S.bath, Kitchen: S.kit, Size: S.size, Floor: S.floor, Storage: S.store, Balcony: S.balc, ...(S.feat ? { Features: S.feat } : {}) }) + `<p class="np">${esc(S.desc)}</p>`)}
${sec("Location", 1, KV({ Region: S.region, "Town or city": S.town, Area: S.area, "Nearest landmark": S.lm, Map: S.lat ? "Saved from GPS" : "Google Maps link" }) + `<p class="np">Public: area and landmark only. Your exact address is private to NestGH admin.</p>`)}
```

- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 1891-1894

```js
${sec("Price and costs", 2, bd())}
${sec("What is included", 3, tags(INC.map((i) => i + ": " + S.m["inc_" + i]).concat(S.m.inc_Other && S.incOther ? [S.incOther + ": " + S.m.inc_Other] : [])) + `<p class="np"><b>Not included:</b> ${S.nothingSep ? "Nothing. Everything needed is included." : esc(S.notinc)}</p>`)}
${sec("Facilities", 4, tags(FAC.map((i) => i + ": " + S.m["fac_" + i]).concat(S.facOther ? [S.facOther] : [])))}
${sec("Rules", 5, KV({ "Who can stay": S.who.join(", "), "Max occupants": S.maxOcc, Cooking: S.cooking, Visitors: S.visitors, Pets: S.pets, Smoking: S.smoking, Curfew: S.curfew === "Curfew applies" ? "From " + S.curfewTime : "None", Noise: S.noise, ...(S.otherRules ? { Other: S.otherRules } : {}) }))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This walks through each item in a list and makes a new list from it.
- This sticks many pieces together into one bigger text.

### Lines 1895-1895

```js
${sec("Availability", 6, KV({ Available: S.avail, "Available from": S.from, "Units available": S.aunits, Confirmed: "Today (recorded automatically when you submit)" }))}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1896-1899

```js
${sec("Photos", 7, `<div class="rvp">${al.map((s) => `<img src="${s}" alt="Listing photo">`).join("")}</div>`)}
${sec("Owner or caretaker", 8, `<div style="display:flex;gap:12px;align-items:center"><div class="av" style="margin:0;border-style:solid"><img src="${S.profile}" alt="Profile photo"></div><div><b>${esc(S.name)}</b><div class="np" style="margin:0">${esc(S.role)}. ${esc(S.rel)}</div></div></div>` + KV({ "Shown to seekers": "Profile photo, name, role, WhatsApp and Call buttons", Phone: S.phone, WhatsApp: S.wa }) + `<div class="vs"><span>Phone: not verified yet</span><span>Identity: not verified yet</span><span>Property: not verified yet</span></div>`)}
<div class="warn">CHECK YOUR INFORMATION CAREFULLY</div><div class="fld" data-f="consent"><label class="ch line"><input type="checkbox" data-k="accurate"${S.accurate ? " checked" : ""}><span>I confirm that all information is accurate.</span></label>
${CONS.map((c, i) => `<label class="ch line"><input type="checkbox" data-cons="${i}"${S.cons[i] ? " checked" : ""}><span>${c}</span></label>`).join("")}<em class="er"></em></div>
```

- This walks through each item in a list and makes a new list from it.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This walks through each item in a list and makes a new list from it.

### Lines 1900-1900

```js
<p class="pv2"><b>Privacy notice.</b> NestGH uses what you submit to review and publish your listing, contact you about availability, and prevent fraud. Your profile photo, name, role and contact buttons may be shown on your listing. Your exact address is only seen by NestGH admin, and identity documents are never shown publicly. You can ask to see, correct or delete your information under Ghana's Data Protection Act, 2012 (Act 843). Read our full <a href="#" data-pol="privacy">Privacy Policy</a> , <a href="#" data-pol="cookie">Cookie Policy</a> and <a href="#" data-pol="terms">Terms and Conditions</a>.</p>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1901-1901

```js
<div class="tot"><span>Standard listing (one-time)</span><b>${listingFeePesewas === null ? "Unavailable" : formatFeePesewas(listingFeePesewas)}</b></div>${listingFeePesewas === null ? '<p class="warn" role="alert">The current listing fee could not be loaded. Payment is unavailable until the site reconnects to its settings.</p>' : ""}<p class="pv2">There is one package only. No renewal fee: your listing stays live while the room is genuinely available. Payment does not approve or verify your listing. NestGH reviews every listing first.</p>`;
```

- This line is building HTML text, which is the page's visible structure.

### Lines 1902-1905

```js
    },
    v: () => {
      const e = {};
      if (!S.accurate || CONS.some((_, i) => !S.cons[i]))
```

- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This starts an object named `e`. An object is like a labeled cubby shelf where each label points to some data.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1906-1909

```js
        e.consent = "Please tick every box to continue.";
      if (listingFeePesewas === null)
        e.listingFee =
          "The current listing fee could not be loaded. Please refresh and try again.";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1910-1913

```js
      return e;
    },
  },
];
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 1914-1917

```js
function show(e) {
  document.querySelectorAll(".bad").forEach((x) => {
    x.classList.remove("bad");
    const m = x.querySelector(".er");
```

- This starts a function named `show`. It is a little recipe card the file can use later.
- This goes through each item one by one and does the same kind of job for each.
- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1918-1921

```js
    m && (m.textContent = "");
  });
  let first = null,
    extra = [];
```

- This changes the plain text shown on the page.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1922-1925

```js
  for (const [k, v] of Object.entries(e)) {
    const el = document.querySelector(`#lb [data-f="${k}"]`);
    if (!el) {
      extra.push(v);
```

- This opens a new block of work. The lines underneath belong to this idea.
- This makes a box named `el` and stores the first matching page part. It is like asking the page, “please point me to this thing.”
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1926-1929

```js
      continue;
    }
    el.classList.add("bad");
    el.querySelector(".er").textContent = v;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.
- This changes the plain text shown on the page.

### Lines 1930-1933

```js
    first = first || el;
  }
  const c = Object.keys(e).length;
  $("sum").textContent = c
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.

### Lines 1934-1937

```js
    ? "Please fix " +
      c +
      " item" +
      (c > 1 ? "s" : "") +
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1938-1941

```js
      " below." +
      (extra.length ? " " + extra.join(" ") : "")
    : "";
  if (first) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1942-1945

```js
    first.scrollIntoView({ block: "center" });
    const i = first.querySelector("input,select,textarea,button");
    i && i.focus({ preventScroll: true });
  } else $("sum").scrollIntoView({ block: "center" });
```

- This moves the view so the person can see the important part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This puts the cursor or keyboard attention onto that page part.
- This moves the view so the person can see the important part.

### Lines 1946-1949

```js
}
function dyn() {
  const c = $("cc");
  if (c) {
```

- This closes the piece of code that was opened just above.
- This starts a function named `dyn`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 1950-1950

```js
    const l = (S.desc || "").trim().length;
```

- This tidies text by cutting off extra spaces at the ends.

### Lines 1951-1954

```js
    c.textContent = l + "/100 characters";
    c.className = l >= 100 ? "ok" : "";
  }
  const b = $("bd");
```

- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1955-1958

```js
  if (b) b.innerHTML = bd();
  const po = $("po");
  if (po) po.hidden = S.period !== "Other";
  const on = $("on");
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1959-1962

```js
  if (on) on.hidden = !(n("oth") > 0);
  const ct = $("ct");
  if (ct) ct.hidden = S.curfew !== "Curfew applies";
}
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.

### Lines 1963-1966

```js
function paint() {
  const steps = activeSteps(),
    L = steps.length;
  $("pb").innerHTML =
```

- This starts a function named `paint`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.

### Lines 1967-1967

```js
    `<div class="pt">Step ${cur + 1} of ${L}: <b>${steps[cur].n}</b></div><div class="seg">${steps.map((s, i) => `<i class="${i === cur ? "c" : i < cur ? "d" : ""}"></i>`).join("")}</div>`;
```

- This walks through each item in a list and makes a new list from it.

### Lines 1968-1971

```js
  $("pn").innerHTML = steps.map(
    (s, i) =>
      `<button type="button" data-go="${i}" class="${i === cur ? "c" : done.has(i) ? "d" : ""}"${i > reach ? " disabled" : ""}${i === cur ? ' aria-current="step"' : ""}>${done.has(i) && i !== cur ? "✓ " : ""}${s.n}</button>`,
  ).join('<span aria-hidden="true">→</span>');
```

- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This sticks many pieces together into one bigger text.

### Lines 1972-1975

```js
  $("bk").hidden = cur === 0;
  $("nx").textContent =
    cur === L - 1
      ? S.ref
```

- This chooses whether a page part should be hidden or shown.
- This changes the plain text shown on the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1976-1979

```js
        ? "Retry payment"
        : "Submit & pay" +
          (listingFeePesewas === null
            ? ""
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 1980-1983

```js
            : " " + formatFeePesewas(listingFeePesewas))
      : "Next";
  const a = $("pn").querySelector(".c");
  a && a.scrollIntoView({ inline: "center", block: "nearest" });
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This moves the view so the person can see the important part.

### Lines 1984-1987

```js
}
function draw() {
  $("lb").innerHTML =
    '<div class="sum" id="sum" role="alert"></div><div class="listing-step-content">' + activeSteps()[cur].r() + "</div>";
```

- This closes the piece of code that was opened just above.
- This starts a function named `draw`. It is a little recipe card the file can use later.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line is building HTML text, which is the page's visible structure.

### Lines 1988-1991

```js
  paint();
  dyn();
}
function go(i) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This starts a function named `go`. It is a little recipe card the file can use later.

### Lines 1992-1995

```js
  cur = i;
  reach = Math.max(reach, i);
  draw();
  $("lf").scrollTo(0, 0);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This moves the view so the person can see the important part.

### Lines 1996-1999

```js
}
async function next() {
  const steps = activeSteps();
  if (cur === steps.length - 1) {
```

- This closes the piece of code that was opened just above.
- This starts a function named `next`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2000-2003

```js
    await submit();
    return;
  }
  const e = steps[cur].v();
```

- This waits for a slow job to finish before moving on.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2004-2007

```js
  if (Object.keys(e).length) {
    done.delete(cur);
    paint();
    show(e);
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2008-2011

```js
    return;
  }
  done.add(cur);
  go(cur + 1);
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2012-2015

```js
}
async function submit() {
  const displayedFee = listingFeePesewas;
  await refreshListingFee();
```

- This closes the piece of code that was opened just above.
- This starts a function named `submit`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This waits for a slow job to finish before moving on.

### Lines 2016-2019

```js
  if (listingFeePesewas !== null && displayedFee !== listingFeePesewas) {
    S.feeChanged = true;
    draw();
    return;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 2020-2023

```js
  }
  S.feeChanged = false;
  draw();
  const steps = activeSteps();
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2024-2027

```js
  for (let i = 0; i < steps.length; i++) {
    const e = steps[i].v();
    if (Object.keys(e).length) {
      go(i);
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2028-2031

```js
      show(e);
      if (i < steps.length - 1)
        toast(
          "Please fix step " + (i + 1) + " (" + steps[i].n + ") before paying.",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2032-2035

```js
        );
      return;
    }
  }
```

- This closes the piece of code that was opened just above.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 2036-2039

```js
  await pay();
}
async function pay() {
  if (!supabaseClient) {
```

- This waits for a slow job to finish before moving on.
- This closes the piece of code that was opened just above.
- This starts a function named `pay`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2040-2043

```js
    S.payMsg =
      "Payment is unavailable because Supabase did not load. Please try again later.";
    return go(cur);
  }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 2044-2047

```js
  if (!S.submissionId) S.submissionId = crypto.randomUUID();
  $("psheet").innerHTML =
    `<div class="sp" role="dialog" aria-modal="true" aria-label="Secure payment"><h3 class="sn">Standard listing fee</h3><p class="np">Your listing details will be sent securely for review. Payment is processed by Paystack.</p><div class="tot"><span>One-time listing fee</span><b>${formatFeePesewas(listingFeePesewas)}</b></div><p class="np" role="status">Preparing secure checkout…</p></div>`;
  $("psheet").classList.add("on");
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This line is building HTML text, which is the page's visible structure.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.

### Lines 2048-2051

```js
  updateModalScroll();
  try {
    const images = [
      ...photoCategories().map((category) => S.ph[category]),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This starts an array named `images`. It is a built-in list the rest of the file will look up later.
- This walks through each item in a list and makes a new list from it.

### Lines 2052-2055

```js
      S.profile,
      ...S.extra.map((photo) => photo.src),
    ];
    const estimatedBytes = images.reduce(
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it.
- This closes the piece of code that was opened just above.
- This combines many values into one final answer. `.reduce(...)` means “squash many items into one result,” like adding up coins.

### Lines 2056-2059

```js
      (sum, dataUrl) =>
        sum + Math.ceil((dataUrl.split(",")[1] || "").length * 0.75),
      0,
    );
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 2060-2063

```js
    if (estimatedBytes > 4_250_000)
      throw new Error(
        "The compressed photos are too large to upload together. Remove extra photos or choose smaller images.",
      );
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This stops the normal path and sends out an error message.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 2064-2067

```js
    const form = new FormData();
    const payload = { ...S };
    delete payload.ph;
    delete payload.profile;
```

- This makes a `FormData` parcel so text and files can be sent together.
- This starts an object named `payload`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2068-2071

```js
    delete payload.extra;
    delete payload.submissionId;
    delete payload.payMsg;
    delete payload.ref;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2072-2075

```js
    form.append("submission_id", S.submissionId);
    form.append("listing", JSON.stringify(payload));
    for (const category of photoCategories()) {
      const blob = await (await fetch(S.ph[category])).blob();
```

- This adds a new item onto the end, like putting one more block onto a tower.
- This packs data into JSON text so it can be saved or sent.
- This opens a new block of work. The lines underneath belong to this idea.
- This asks for data from another place, like sending someone to the shop to bring something back.

### Lines 2076-2079

```js
      form.append("photo:" + category, blob, category + ".jpg");
    }
    const profile = await (await fetch(S.profile)).blob();
    form.append("profile_photo", profile, "profile.jpg");
```

- This adds a new item onto the end, like putting one more block onto a tower.
- This closes the piece of code that was opened just above.
- This asks for data from another place, like sending someone to the shop to bring something back.
- This adds a new item onto the end, like putting one more block onto a tower.

### Lines 2080-2083

```js
    for (let i = 0; i < S.extra.length; i++) {
      const blob = await (await fetch(S.extra[i].src)).blob();
      form.append("photo:Extra " + (i + 1), blob, "extra-" + (i + 1) + ".jpg");
    }
```

- This opens a new block of work. The lines underneath belong to this idea.
- This asks for data from another place, like sending someone to the shop to bring something back.
- This adds a new item onto the end, like putting one more block onto a tower.
- This closes the piece of code that was opened just above.

### Lines 2084-2087

```js
    await beginCheckout(form);
  } catch (error) {
    console.error("Could not start listing payment:", error);
    $("psheet").classList.remove("on");
```

- This waits for a slow job to finish before moving on.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This removes a CSS class, like taking a label off a page part.

### Lines 2088-2091

```js
    updateModalScroll();
    S.payMsg =
      error instanceof Error
        ? error.message
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2092-2095

```js
        : "Secure checkout could not be started.";
    go(cur);
    toast(S.payMsg);
  }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 2096-2099

```js
}
function reset() {
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, { m: {}, ph: {}, extra: [], who: [], cons: [] });
```

- This closes the piece of code that was opened just above.
- This starts a function named `reset`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2100-2100

```js
  cur = 0;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2101-2104

```js
  reach = 0;
  done.clear();
  $("lf").classList.remove("fin", "on");
  updateModalScroll();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2105-2108

```js
}
async function openLF() {
  await requestLocationCatalog();
  $("lf").classList.add("on");
```

- This closes the piece of code that was opened just above.
- This starts a function named `openLF`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This waits for a slow job to finish before moving on.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.

### Lines 2109-2112

```js
  updateModalScroll();
  go(cur);
  await refreshListingFee();
  if (cur === activeSteps().length - 1) draw();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This waits for a slow job to finish before moving on.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2113-2116

```js
}
function closeLF() {
  $("lf").classList.remove("on");
  updateModalScroll();
```

- This closes the piece of code that was opened just above.
- This starts a function named `closeLF`. It is a little recipe card the file can use later.
- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2117-2120

```js
}
const shrink = (f, max, q) =>
  new Promise((ok, no) => {
    const u = URL.createObjectURL(f),
```

- This closes the piece of code that was opened just above.
- This makes a short helper function named `shrink`. It is a tiny shortcut recipe.
- This opens a new block of work. The lines underneath belong to this idea. A **Promise** is like a note saying, “I will give you the result later.”
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2121-2124

```js
      im = new Image();
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a brand-new page element in memory so the code can add it to the page.

### Lines 2125-2128

```js
      c.width = Math.round(im.width * k);
      c.height = Math.round(im.height * k);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(u);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2129-2132

```js
      ok(c.toDataURL("image/jpeg", q));
    };
    im.onerror = () => {
      URL.revokeObjectURL(u);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2133-2136

```js
      no("type");
    };
    im.src = u;
  });
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 2137-2140

```js
async function pic(f, max, q) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) throw "type";
  if (f.size > 15 * 1048576) throw "size";
  return shrink(f, max, q);
```

- This starts a function named `pic`. It is a little recipe card the file can use later and it may pause while waiting for slow work.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 2141-2144

```js
}
const perr = (x) =>
  x === "size"
    ? "That photo is too large. Please use a photo under 15 MB."
```

- This closes the piece of code that was opened just above.
- This makes a short helper function named `perr`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2145-2148

```js
    : "Unsupported file. Please use a JPG, PNG or WebP image.";
function keep(fn) {
  const y = $("lf").scrollTop;
  fn();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `keep`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2149-2152

```js
  draw();
  $("lf").scrollTop = y;
}
function upd(e) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This starts a function named `upd`. It is a little recipe card the file can use later.

### Lines 2153-2156

```js
  const t = e.target,
    d = t.dataset;
  if (d.k !== undefined) {
    const k = d.k;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2157-2160

```js
    S[k] = t.type === "checkbox" ? t.checked : t.value;
    if (k === "category") {
      for (const key of [
        "type",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2161-2164

```js
        "otherType",
        "furn",
        "beds",
        "bath",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2165-2168

```js
        "kit",
        "floor",
        "store",
        "balc",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2169-2172

```js
        "feat",
        "size",
        "roadVisibility",
        "parking",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2173-2176

```js
        "electricity",
        "water",
        "advanceAmount",
        "adv",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2177-2180

```js
      ]) delete S[key];
      S.ph = {};
      S.extra = [];
      done.clear();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2181-2184

```js
      reach = 0;
      if (S.category === "commercial") S.period = "Monthly";
      else delete S.period;
      draw();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This is the fallback path: if the earlier rule was not true, do this instead.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2185-2188

```js
      return;
    }
    if (k === "type" && S.category === "commercial") {
      draw();
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2189-2192

```js
      return;
    }
    if (k === "region") {
      S.town = "";
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2193-2196

```js
      const city = $("f_town");
      if (city) city.value = "";
    }
    if (k === "region" || k === "town")
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2197-2200

```js
      populateOwnerTownOptions(k === "town" ? t.value : "", S.region || "");
    if (k === "phone" && S.waSame) {
      S.wa = S.phone;
      const w = $("f_wa");
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2201-2204

```js
      w && (w.value = S.wa);
    }
    if (k === "waSame" && t.checked) {
      S.wa = S.phone || "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2205-2208

```js
      const w = $("f_wa");
      w && (w.value = S.wa);
    }
    if (k === "avail" && t.value.startsWith("Yes")) {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2209-2212

```js
      S.from = today();
      const f = $("f_from");
      f && (f.value = S.from);
    }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 2213-2216

```js
    if (k === "wa" && S.waSame && S.wa !== S.phone) {
      S.waSame = false;
      const c = document.querySelector('[data-k="waSame"]');
      c && (c.checked = false);
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This makes a box named `c` and stores the first matching page part. It is like asking the page, “please point me to this thing.”
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2217-2220

```js
    }
    if (k === "curfew" || k === "period" || k === "oth") dyn();
  } else if (d.c) {
    const a = S[d.c] || (S[d.c] = []);
```

- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2221-2224

```js
    if (t.checked) {
      if (t.value === "Anyone") {
        a.length = 0;
        document.querySelectorAll('[data-c="who"]').forEach((x) => {
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.

### Lines 2225-2228

```js
          if (x !== t) x.checked = false;
        });
      } else {
        const i = a.indexOf("Anyone");
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2229-2232

```js
        if (i > -1) {
          a.splice(i, 1);
          document.querySelector('[data-c="who"][value="Anyone"]').checked =
            false;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2233-2236

```js
        }
      }
      a.push(t.value);
    } else {
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.

### Lines 2237-2240

```js
      const i = a.indexOf(t.value);
      i > -1 && a.splice(i, 1);
    }
  } else if (d.m) S.m[d.m] = t.value;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2241-2244

```js
  else if (d.cons !== undefined) S.cons[+d.cons] = t.checked;
  else if (d.xc !== undefined) S.extra[+d.xc].cat = t.value;
  else return;
  const f = t.closest("[data-f]");
```

- This is the next rule to try if the earlier rule did not win.
- This is the next rule to try if the earlier rule did not win.
- This is the fallback path: if the earlier rule was not true, do this instead.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2245-2248

```js
  if (f) {
    f.classList.remove("bad");
    const m = f.querySelector(".er");
    m && (m.textContent = "");
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.

### Lines 2249-2250

```js
  }
  dyn();
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2251-2254

```js
}
const L = $("lf");
L.addEventListener("input", upd);
L.addEventListener("change", async (e) => {
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This tells the page to listen for something happening and then run code when it happens.
- This tells the page to listen for something happening and then run code when it happens.

### Lines 2255-2258

```js
  upd(e);
  const t = e.target,
    d = t.dataset,
    fs = [...(t.files || [])];
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2259-2262

```js
  if (!fs.length) return;
  try {
    if (d.ph) {
      S.ph[d.ph] = await pic(fs[0], 1000, 0.68);
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This waits for a slow job to finish before moving on.

### Lines 2263-2266

```js
      keep(() => {});
    } else if (d.pf !== undefined) {
      S.profile = await pic(fs[0], 512, 0.75);
      keep(() => {});
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This waits for a slow job to finish before moving on.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2267-2270

```js
    } else if (d.xph !== undefined) {
      let bad = 0;
      for (const f of fs) {
        if (S.extra.length >= 10) break;
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2271-2274

```js
        try {
          S.extra.push({ src: await pic(f, 1000, 0.68), cat: "Other" });
        } catch {
          bad++;
```

- This opens a new block of work. The lines underneath belong to this idea.
- This waits for a slow job to finish before moving on.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2275-2278

```js
        }
      }
      keep(() => {});
      bad && toast(bad + " file(s) skipped: use JPG, PNG or WebP under 15 MB.");
```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2279-2282

```js
    }
  } catch (x) {
    t.value = "";
    const k = d.ph ? "ph_" + d.ph : "profile";
```

- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2283-2286

```js
    show({ [k]: perr(x) });
  }
});
L.addEventListener("click", (e) => {
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This tells the page to listen for something happening and then run code when it happens.

### Lines 2287-2290

```js
  const t = e.target.closest("button,a");
  if (!t) return;
  const d = t.dataset;
  if (d.go !== undefined) go(+d.go);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2291-2294

```js
  else if (d.rm) keep(() => delete S.ph[d.rm]);
  else if (d.xu !== undefined) {
    const i = +d.xu;
    i > 0 &&
```

- This is the next rule to try if the earlier rule did not win.
- This is the next rule to try if the earlier rule did not win.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2295-2298

```js
      keep(() => ([S.extra[i - 1], S.extra[i]] = [S.extra[i], S.extra[i - 1]]));
  } else if (d.xd !== undefined) {
    const i = +d.xd;
    i < S.extra.length - 1 &&
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2299-2302

```js
      keep(() => ([S.extra[i + 1], S.extra[i]] = [S.extra[i], S.extra[i + 1]]));
  } else if (d.xr !== undefined) keep(() => S.extra.splice(+d.xr, 1));
  else if (t.id === "gps") {
    if (!navigator.geolocation)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This is the next rule to try if the earlier rule did not win.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2303-2306

```js
      return toast(
        "Location is not available. Paste a Google Maps link instead.",
      );
    navigator.geolocation.getCurrentPosition(
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks whether the browser can ask the device for its location.

### Lines 2307-2310

```js
      (p) => {
        S.lat = p.coords.latitude.toFixed(5);
        S.lng = p.coords.longitude.toFixed(5);
        $("mapst").textContent = "Location saved: " + S.lat + ", " + S.lng;
```

- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This changes the plain text shown on the page.

### Lines 2311-2314

```js
        const f = document.querySelector('[data-f="map"]');
        f.classList.remove("bad");
        f.querySelector(".er").textContent = "";
      },
```

- This makes a box named `f` and stores the first matching page part. It is like asking the page, “please point me to this thing.”
- This removes a CSS class, like taking a label off a page part.
- This changes the plain text shown on the page.
- This closes the piece of code that was opened just above.

### Lines 2315-2318

```js
      () =>
        toast("Could not get your location. Paste a Google Maps link instead."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 2319-2322

```js
  } else if (t.id === "dn") reset();
});
$("bk").onclick = () => go(cur - 1);
$("nx").onclick = next;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2323-2325

```js
$("lx").onclick = closeLF;
["l1", "l2"].forEach((i) => ($(i).onclick = openLF));

```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This goes through each item one by one and does the same kind of job for each.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 2326-2329

```js
/* ===== POLICIES ===== */
const POLT = {
  privacy: "Privacy Policy",
  cookie: "Cookie Policy",
```

- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This starts an object named `POLT`. An object is like a labeled cubby shelf where each label points to some data.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2330-2333

```js
  terms: "Terms and Conditions",
};
function openPol(k) {
  $("pt2").textContent = POLT[k];
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This starts a function named `openPol`. It is a little recipe card the file can use later.
- This changes the plain text shown on the page.

### Lines 2334-2337

```js
  $("pc").innerHTML = $("t-" + k).innerHTML;
  $("pol").classList.add("on");
  $("pol").scrollTo(0, 0);
  updateModalScroll();
```

- This replaces the HTML inside a page part. It is like emptying a toy box and putting new toys inside.
- This adds a CSS class, which is like sticking a label on a page part so it looks or behaves differently.
- This moves the view so the person can see the important part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2338-2341

```js
}
function closePol() {
  $("pol").classList.remove("on");
  updateModalScroll();
```

- This closes the piece of code that was opened just above.
- This starts a function named `closePol`. It is a little recipe card the file can use later.
- This removes a CSS class, like taking a label off a page part.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2342-2345

```js
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-pol]");
  if (a) {
```

- This closes the piece of code that was opened just above.
- This tells the page to listen for something happening and then run code when it happens.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 2346-2349

```js
    e.preventDefault();
    openPol(a.dataset.pol);
  }
});
```

- This stops the browser from doing its usual action so this file can do a custom one instead.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 2350-2353

```js
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("pol").classList.contains("on")) closePol();
});
$("px").onclick = closePol;
```

- This tells the page to listen for something happening and then run code when it happens.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2354-2357

```js

/* ===== COOKIE PREFERENCES ===== */
const COOKIE_CONSENT_KEY = "nestgh_cookie_consent_v1";
const cookieBanner = $("cookie-banner");
```

- This empty line is just a small breathing space so the code is easier to read.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2358-2361

```js
function showCookieBanner() {
  cookieBanner.hidden = false;
}
function saveCookieChoice(choice) {
```

- This starts a function named `showCookieBanner`. It is a little recipe card the file can use later.
- This chooses whether a page part should be hidden or shown.
- This closes the piece of code that was opened just above.
- This starts a function named `saveCookieChoice`. It is a little recipe card the file can use later.

### Lines 2362-2365

```js
  try {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ choice, updatedAt: new Date().toISOString() }),
```

- This opens a new block of work. The lines underneath belong to this idea.
- This reads from or writes to the browser's long-term little cupboard.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This packs data into JSON text so it can be saved or sent.

### Lines 2366-2369

```js
    );
    cookieBanner.hidden = true;
  } catch {
    toast(
```

- This closes the piece of code that was opened just above.
- This chooses whether a page part should be hidden or shown.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2370-2373

```js
      "Your cookie choice could not be saved. Please check your browser storage settings.",
    );
  }
}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 2374-2377

```js
try {
  if (!localStorage.getItem(COOKIE_CONSENT_KEY)) showCookieBanner();
} catch {
  showCookieBanner();
```

- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 2378-2381

```js
  toast(
    "Browser storage is unavailable. Your cookie choice may not be remembered.",
  );
}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.

### Lines 2382-2385

```js
$("cookie-accept").onclick = () => saveCookieChoice("accepted");
$("cookie-reject").onclick = () => saveCookieChoice("rejected");
$("cookie-settings").onclick = (e) => {
  e.preventDefault();
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This stops the browser from doing its usual action so this file can do a custom one instead.

### Lines 2386-2387

```js
  showCookieBanner();
};
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.


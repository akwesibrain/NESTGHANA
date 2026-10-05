# commercial-listings.js explained

This file is like the shop wing in a house.

## commercial-listings.js

### Lines 1-4

```js
(function registerCommercialListings(root, createApi) {
  const api = createApi();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NestGHCommercial = api;
```

- This opens a new block of work. The lines underneath belong to this idea. A **function** is like a little recipe card: give it a name, and the code can run those steps later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order. The word **const** makes a named storage box. A **variable** is like a labeled toy box that holds a value.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 5-5

```js
})(typeof globalThis === "undefined" ? this : globalThis, function createApi() {
```

- This opens a new block of work. The lines underneath belong to this idea.

### Lines 6-28

```js
  /**
   * A commercial record is published in public_listings.public_data with
   * category "commercial" and the same property fields consumed below.
   * Numeric fields are stored as numbers and feature availability as booleans.
   * @typedef {Object} CommercialListing
   * @property {string} id
   * @property {string} title
   * @property {"commercial"} category
   * @property {string} type
   * @property {string|null} location
   * @property {number|null} rent
   * @property {number|null} advance
   * @property {number|null} size
   * @property {string|null} sizeUnit
   * @property {boolean|string|null} roadVisibility
   * @property {boolean|string|null} parking
   * @property {boolean|string|null} electricity
   * @property {boolean|string|null} water
   * @property {number|null} estimatedMoveInCost
   * @property {string|null} availability
   * @property {string[]} images
   * @property {string|null} description
   */
```

- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs. An **array** is like a row of lunch boxes holding many items in order.
- This is a comment. It is a note for people reading the file, not a step the browser runs.
- This is a comment. It is a note for people reading the file, not a step the browser runs.

### Lines 29-32

```js
  const TYPES = Object.freeze([
    "Shop",
    "Store",
    "Office",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order. `Object.freeze` means “lock this object so nobody changes it by accident.”
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 33-36

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

### Lines 37-40

```js
    "Commercial Space",
    "Other",
  ]);
  const PAGE_SIZE = 24;
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 41-44

```js

  function optionalText(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }
```

- This empty line is just a small breathing space so the code is easier to read.
- This starts a function named `optionalText`. It is a little recipe card the file can use later.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 45-48

```js

  function optionalNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
```

- This empty line is just a small breathing space so the code is easier to read.
- This starts a function named `optionalNumber`. It is a little recipe card the file can use later.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 49-51

```js
    return Number.isFinite(number) && number >= 0 ? number : null;
  }

```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 52-55

```js
  function optionalBoolean(value) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
```

- This starts a function named `optionalBoolean`. It is a little recipe card the file can use later.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 56-58

```js
    return null;
  }

```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 59-62

```js
  function optionalFacet(value) {
    return typeof value === "boolean" ? value : optionalText(value);
  }

```

- This starts a function named `optionalFacet`. It is a little recipe card the file can use later.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 63-66

```js
  function safeImagePath(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    const path = value.trim();
    if (path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")) {
```

- This starts a function named `safeImagePath`. It is a little recipe card the file can use later.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This tidies text by cutting off extra spaces at the ends.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 67-70

```js
      return path;
    }
    try {
      const url = new URL(path);
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.
- This opens a new block of work. The lines underneath belong to this idea.
- This builds or checks a web address in a careful way.

### Lines 71-74

```js
      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This opens a new block of work. The lines underneath belong to this idea.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 75-76

```js
  }

```

- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 77-80

```js
  function normalize(row) {
    const data = row && row.public_data;
    if (!data || !["commercial", "shops_spaces"].includes(data.category)) {
      return null;
```

- This starts a function named `normalize`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 81-84

```js
    }
    const id = optionalText(row.id);
    const title = optionalText(data.title);
    const type = optionalText(data.type);
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 85-86

```js
    if (!id || !title || !type) return null;

```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 87-90

```js
    const location = optionalText(data.location);
    const images = Array.isArray(data.images)
      ? data.images.map(safeImagePath).filter(Boolean)
      : Array.isArray(data.photos)
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This walks through each item in a list and makes a new list from it. `.map(...)` means “go through each item and build a new list from it.” `.filter(...)` means “keep only the items that pass the rule.”
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 91-93

```js
        ? data.photos.map(safeImagePath).filter(Boolean)
        : [];

```

- This walks through each item in a list and makes a new list from it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 94-97

```js
    return Object.freeze({
      id,
      title,
      category: "commercial",
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 98-101

```js
      type,
      location,
      rent: optionalNumber(data.rent),
      advance: optionalNumber(data.advance),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 102-105

```js
      size: optionalNumber(data.size),
      sizeUnit: optionalText(data.sizeUnit),
      roadVisibility: optionalFacet(data.roadVisibility),
      parking: optionalFacet(data.parking),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 106-109

```js
      electricity: optionalFacet(data.electricity),
      water: optionalFacet(data.water),
      estimatedMoveInCost: optionalNumber(data.estimatedMoveInCost),
      availability: optionalText(data.availability),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 110-113

```js
      images: Object.freeze(images),
      description: optionalText(data.description),
      phone: optionalText(data.phone),
      whatsapp: optionalText(data.whatsapp),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 114-116

```js
    });
  }

```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 117-120

```js
  function readFilters(form) {
    const values = new FormData(form);
    const number = (key) => optionalNumber(values.get(key));
    const triState = (key) => optionalBoolean(values.get(key));
```

- This starts a function named `readFilters`. It is a little recipe card the file can use later.
- This makes a `FormData` parcel so text and files can be sent together. `FormData` is a little parcel the browser uses to bundle form values and files together.
- This makes a short helper function named `number`. It is a tiny shortcut recipe.
- This makes a short helper function named `triState`. It is a tiny shortcut recipe.

### Lines 121-124

```js
    return Object.freeze({
      location: optionalText(values.get("location")),
      region: optionalText(values.get("region")),
      town: optionalText(values.get("town")),
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 125-128

```js
      minRent: number("minRent"),
      maxRent: number("maxRent"),
      type: optionalText(values.get("type")),
      minSize: number("minSize"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 129-132

```js
      maxSize: number("maxSize"),
      roadVisibility: triState("roadVisibility"),
      parking: triState("parking"),
      electricity: triState("electricity"),
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 133-136

```js
      water: triState("water"),
    });
  }

```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 137-140

```js
  function queryPage(client, filters, offset = 0) {
    let query = client
      .from("public_listings")
      .select("id,public_data,created_at")
```

- This starts a function named `queryPage`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order. The word **let** also makes a variable, but this kind of box is allowed to change later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 141-144

```js
      .contains("public_data", { category: "commercial" })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true });

```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 145-148

```js
    if (filters.region) {
      query = query.eq("public_data->>region", filters.region);
    }
    if (filters.town) {
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 149-150

```js
      query = query.eq("public_data->>town", filters.town);
    }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 151-154

```js
    if (filters.location) {
      query = query.ilike("public_data->>location", `%${filters.location}%`);
    }
    if (filters.type) query = query.eq("public_data->>type", filters.type);
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 155-158

```js
    if (filters.minRent !== null) {
      query = query.gte("public_data->rent", filters.minRent);
    }
    if (filters.maxRent !== null) {
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.

### Lines 159-162

```js
      query = query.lte("public_data->rent", filters.maxRent);
    }
    if (filters.minSize !== null) {
      query = query.gte("public_data->size", filters.minSize);
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 163-166

```js
    }
    if (filters.maxSize !== null) {
      query = query.lte("public_data->size", filters.maxSize);
    }
```

- This closes the piece of code that was opened just above.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 167-170

```js
    for (const field of ["roadVisibility", "parking", "electricity", "water"]) {
      if (filters[field] !== null) {
        query = query.eq(`public_data->${field}`, filters[field]);
      }
```

- This opens a new block of work. The lines underneath belong to this idea.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.

### Lines 171-174

```js
    }
    const start = Math.max(0, Math.trunc(offset));
    return query.range(start, start + PAGE_SIZE - 1);
  }
```

- This closes the piece of code that was opened just above.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 175-178

```js

  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
```

- This empty line is just a small breathing space so the code is easier to read.
- This starts a function named `escapeHtml`. It is a little recipe card the file can use later.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line is building HTML text, which is the page's visible structure.

### Lines 179-182

```js
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This opens a new block of work. The lines underneath belong to this idea.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 183-186

```js
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 187-189

```js
    );
  }

```

- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 190-193

```js
  function formatCedi(amount) {
    if (typeof amount !== "number" || !Number.isFinite(amount)) return "";
    return `GH₵ ${amount.toLocaleString("en-GH")}`;
  }
```

- This starts a function named `formatCedi`. It is a little recipe card the file can use later.
- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This closes the piece of code that was opened just above.

### Lines 194-197

```js

  function renderCard(listing, { saved, icon, saveIcon }) {
    const image = listing.images[0]
      ? `<img src="${escapeHtml(listing.images[0])}" alt="${escapeHtml(listing.title)}" loading="lazy" decoding="async">`
```

- This empty line is just a small breathing space so the code is easier to read.
- This starts a function named `renderCard`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure. A special word like **async** means this recipe can pause while waiting for something slow, like waiting for toast to pop up.

### Lines 198-201

```js
      : `<div class="commercial-placeholder" role="img" aria-label="No property image provided">${icon}</div>`;
    const facts = [
      listing.size !== null
        ? `<span>${escapeHtml(`${listing.size}${listing.sizeUnit ? ` ${listing.sizeUnit}` : ""}`)}</span>`
```

- This line is building HTML text, which is the page's visible structure.
- This starts an array named `facts`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 202-205

```js
        : "",
      listing.roadVisibility !== null
        ? `<span>${escapeHtml(
            typeof listing.roadVisibility === "boolean"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 206-209

```js
              ? listing.roadVisibility
                ? "Road visible"
                : "Not road visible"
              : listing.roadVisibility,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 210-213

```js
          )}</span>`
        : "",
      listing.parking !== null
        ? `<span>${escapeHtml(
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 214-217

```js
            typeof listing.parking === "boolean"
              ? listing.parking
                ? "Parking"
                : "No parking"
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 218-221

```js
              : listing.parking,
          )}</span>`
        : "",
      listing.electricity !== null
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 222-225

```js
        ? `<span>${escapeHtml(
            typeof listing.electricity === "boolean"
              ? listing.electricity
                ? "Electricity"
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 226-229

```js
                : "No electricity"
              : listing.electricity,
          )}</span>`
        : "",
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 230-233

```js
      listing.water !== null
        ? `<span>${escapeHtml(
            typeof listing.water === "boolean"
              ? listing.water
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 234-237

```js
                ? "Water"
                : "No water"
              : listing.water,
          )}</span>`
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 238-241

```js
        : "",
    ].filter(Boolean);
    return `<article class="commercial-card" data-commercial-id="${escapeHtml(listing.id)}">
      <div class="commercial-image">${image}<span class="commercial-type">${escapeHtml(listing.type)}</span>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line is building HTML text, which is the page's visible structure.

### Lines 242-242

```js
        <button class="hb commercial-save" type="button" data-commercial-save="${escapeHtml(listing.id)}" aria-label="${saved ? "Remove saved space" : "Save space"}" aria-pressed="${saved}"><span aria-hidden="true">${saveIcon}</span></button>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 243-246

```js
      </div>
      <div class="commercial-card-body">
        <h3>${escapeHtml(listing.title)}</h3>
        ${listing.location ? `<p class="commercial-location">${icon}<span>${escapeHtml(listing.location)}</span></p>` : ""}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 247-250

```js
        ${facts.length ? `<div class="commercial-facts">${facts.join("")}</div>` : ""}
        <div class="commercial-pricing">
          ${listing.rent !== null ? `<p class="commercial-rent"><b>${formatCedi(listing.rent)}</b><span>/ month</span></p>` : ""}
          ${listing.advance !== null ? `<p><span>Advance</span><b>${formatCedi(listing.advance)}</b></p>` : ""}
```

- This sticks many pieces together into one bigger text.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 251-251

```js
          ${listing.estimatedMoveInCost !== null ? `<p class="commercial-move-in"><span>Estimated move-in cost</span><b>${formatCedi(listing.estimatedMoveInCost)}</b></p>` : ""}
```

- This line is building HTML text, which is the page's visible structure.

### Lines 252-255

```js
        </div>
        ${listing.availability ? `<p class="commercial-availability"><span class="availability-dot" aria-hidden="true"></span>${escapeHtml(listing.availability)}</p>` : ""}
        <button class="btn commercial-details-button" type="button" data-commercial-details="${escapeHtml(listing.id)}">View Details</button>
      </div>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 256-258

```js
    </article>`;
  }

```

- This line is building HTML text, which is the page's visible structure.
- This closes the piece of code that was opened just above.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 259-262

```js
  function renderDetails(listing, { icon, interestUrl, callUrl }) {
    const images = listing.images.length
      ? `<div class="commercial-gallery">${listing.images
          .map(
```

- This starts a function named `renderDetails`. It is a little recipe card the file can use later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This walks through each item in a list and makes a new list from it.

### Lines 263-266

```js
            (image, index) =>
              `<img src="${escapeHtml(image)}" alt="${escapeHtml(listing.title)} photo ${index + 1}" loading="lazy" decoding="async">`,
          )
          .join("")}</div>`
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This sticks many pieces together into one bigger text.

### Lines 267-267

```js
      : `<div class="commercial-placeholder commercial-details-placeholder" role="img" aria-label="No property images provided">${icon}<span>No property images provided</span></div>`;
```

- This line is building HTML text, which is the page's visible structure.

### Lines 268-271

```js
    const rows = [
      ["Space type", listing.type],
      ["Monthly rent", listing.rent === null ? null : `${formatCedi(listing.rent)} / month`],
      ["Advance", listing.advance === null ? null : formatCedi(listing.advance)],
```

- This starts an array named `rows`. It is a built-in list the rest of the file will look up later.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 272-275

```js
      ["Size", listing.size === null ? null : `${listing.size}${listing.sizeUnit ? ` ${listing.sizeUnit}` : ""}`],
      ["Road visibility", listing.roadVisibility === null ? null : typeof listing.roadVisibility === "boolean" ? listing.roadVisibility ? "Yes" : "No" : listing.roadVisibility],
      ["Parking", listing.parking === null ? null : typeof listing.parking === "boolean" ? listing.parking ? "Available" : "Not available" : listing.parking],
      ["Electricity", listing.electricity === null ? null : typeof listing.electricity === "boolean" ? listing.electricity ? "Available" : "Not available" : listing.electricity],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 276-276

```js
      ["Water", listing.water === null ? null : typeof listing.water === "boolean" ? listing.water ? "Available" : "Not available" : listing.water],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 277-280

```js
      ["Estimated move-in cost", listing.estimatedMoveInCost === null ? null : formatCedi(listing.estimatedMoveInCost)],
      ["Availability", listing.availability],
    ].filter(([, value]) => value !== null);
    const features = [
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This keeps only the items that match the rule.
- This starts an array named `features`. It is a built-in list the rest of the file will look up later.

### Lines 281-284

```js
      ["Road visibility", listing.roadVisibility],
      ["Parking", listing.parking],
      ["Electricity", listing.electricity],
      ["Water", listing.water],
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 285-288

```js
    ].filter(([, value]) => value !== null);
    const formatFeature = (value) =>
      typeof value === "boolean" ? (value ? "Available" : "Not available") : value;
    const location = listing.location
```

- This keeps only the items that match the rule.
- This makes a short helper function named `formatFeature`. It is a tiny shortcut recipe.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 289-292

```js
      ? `<p class="property-summary-location">${icon}<span>${escapeHtml(listing.location)}</span></p>`
      : "";
    const contact = interestUrl
      ? `<a class="btn wa" href="${escapeHtml(interestUrl)}" target="_blank" rel="noopener">Contact Owner</a>`
```

- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.

### Lines 293-296

```js
      : "";
    const call = callUrl
      ? `<a class="btn2 commercial-call" href="${escapeHtml(callUrl)}">Call owner</a>`
      : "";
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 297-297

```js
    return `<div class="sp commercial-detail property-details" role="dialog" aria-modal="true" aria-label="${escapeHtml(`Property details: ${listing.title}`)}">
```

- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.

### Lines 298-301

```js
      <button class="x" id="cx" aria-label="Close">Close ✕</button>
      <header class="property-details-heading"><span class="property-details-mark">${icon}</span><div><h2>Property Details</h2><p>Everything you need to know before you contact.</p></div></header>
      <section class="property-summary">
        <div class="property-summary-image">${listing.images[0] ? `<img src="${escapeHtml(listing.images[0])}" alt="${escapeHtml(listing.title)}" decoding="async">` : `<div class="commercial-placeholder" role="img" aria-label="No property image provided">${icon}</div>`}${listing.images.length > 1 ? `<span class="property-photo-count">${listing.images.length} photos</span>` : ""}</div>
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 302-305

```js
        <div class="property-summary-copy">
          <span class="property-kind">${escapeHtml(listing.type)}</span>
          <h3 class="sn">${escapeHtml(listing.title)}</h3>
          ${location}
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 306-309

```js
          ${listing.rent !== null ? `<p class="property-summary-rent">${formatCedi(listing.rent)} <span>/month</span></p>` : ""}
          ${listing.estimatedMoveInCost !== null ? `<p class="property-move-in">Estimated move-in cost <b>${formatCedi(listing.estimatedMoveInCost)}</b></p>` : ""}
          <div class="property-quick-facts">${listing.size !== null ? `<span>${escapeHtml(`${listing.size}${listing.sizeUnit ? ` ${listing.sizeUnit}` : ""}`)}</span>` : ""}${listing.availability ? `<span class="property-availability">${escapeHtml(listing.availability)}</span>` : ""}</div>
        </div>
```

- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 310-313

```js
      </section>
      <div class="property-tabs" role="tablist" aria-label="Property information">
        <button type="button" class="property-tab is-active" id="property-tab-overview" role="tab" aria-selected="true" aria-controls="property-panel-overview" data-property-tab="overview">Overview</button>
        <button type="button" class="property-tab" id="property-tab-facilities" role="tab" aria-selected="false" aria-controls="property-panel-facilities" data-property-tab="facilities">Facilities</button>
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 314-314

```js
        <button type="button" class="property-tab" id="property-tab-location" role="tab" aria-selected="false" aria-controls="property-panel-location" data-property-tab="location">Location</button>
```

- This line is building HTML text, which is the page's visible structure.

### Lines 315-318

```js
      </div>
      <section class="property-panel" id="property-panel-overview" role="tabpanel" aria-labelledby="property-tab-overview" data-property-panel="overview">
        ${listing.description ? `<h4>Description</h4><p class="property-description">${escapeHtml(listing.description)}</p>` : ""}
        ${rows.length ? `<h4>Property details</h4><div class="kv">${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join("")}</div>` : ""}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This walks through each item in a list and makes a new list from it.

### Lines 319-322

```js
      </section>
      <section class="property-panel" id="property-panel-facilities" role="tabpanel" aria-labelledby="property-tab-facilities" data-property-panel="facilities" hidden>
        ${features.length ? `<h4>Property features</h4><div class="property-feature-grid">${features.map(([label, value]) => `<div><span>${icon}</span><b>${escapeHtml(label)}</b><small>${escapeHtml(formatFeature(value))}</small></div>`).join("")}</div>` : '<p class="property-description">No facility details have been provided.</p>'}
        ${listing.images.length > 1 ? `<h4>Photos</h4>${images}` : ""}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This walks through each item in a list and makes a new list from it.
- This line is building HTML text, which is the page's visible structure.

### Lines 323-326

```js
      </section>
      <section class="property-panel" id="property-panel-location" role="tabpanel" aria-labelledby="property-tab-location" data-property-panel="location" hidden>
        ${location ? `<h4>Location</h4>${location}` : '<p class="property-description">No location details have been provided.</p>'}
        ${listing.location ? `<a class="mp" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}">Open area in Maps</a>` : ""}
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.

### Lines 327-330

```js
      </section>
      ${contact || call ? `<section class="property-contact"><div><b>Property owner</b><span>Contact the listing owner directly.</span></div><div class="property-contact-actions">${contact}${call}</div></section>` : ""}
    </div>`;
  }
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line is building HTML text, which is the page's visible structure.
- This line is building HTML text, which is the page's visible structure.
- This closes the piece of code that was opened just above.

### Lines 331-334

```js

  return Object.freeze({
    TYPES,
    PAGE_SIZE,
```

- This empty line is just a small breathing space so the code is easier to read.
- This sends a result back from the current function, like handing the finished sandwich back to the person who asked for it.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 335-338

```js
    normalize,
    readFilters,
    queryPage,
    formatCedi,
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 339-342

```js
    renderCard,
    renderDetails,
  });
});
```

- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.
- This closes the piece of code that was opened just above.


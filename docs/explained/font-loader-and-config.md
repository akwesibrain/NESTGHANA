# font-loader.js and supabase-config.js explained

This file is like the utility closet in a house.

## font-loader.js

### Lines 1-2

```js
const fontStylesheetPreload = document.querySelector("[data-font-stylesheet]");

```

- This makes a box named `fontStylesheetPreload` and stores the first matching page part. It is like asking the page, “please point me to this thing.” The word **const** makes a named storage box. A **variable** is like a labeled toy box that holds a value. The **DOM** is the page's big tree of boxes in the browser. `document` is the browser's way to look through that tree. `querySelector` means “find the first page part that matches this label.” An **array** is like a row of lunch boxes holding many items in order.
- This empty line is just a small breathing space so the code is easier to read.

### Lines 3-6

```js
if (fontStylesheetPreload) {
  const fontStylesheet = document.createElement("link");
  fontStylesheet.rel = "stylesheet";
  fontStylesheet.href = fontStylesheetPreload.href;
```

- This checks a rule. It is like a grown-up at the door deciding whether this path is allowed.
- This makes a brand-new page element in memory so the code can add it to the page.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.

### Lines 7-8

```js
  document.head.append(fontStylesheet);
}
```

- This adds a new item onto the end, like putting one more block onto a tower.
- This closes the piece of code that was opened just above.

## supabase-config.js

### Lines 1-4

```js
window.NESTGH_SUPABASE_CONFIG = Object.freeze({
  url: "https://plbtnltcocsuekifddat.supabase.co",
  publishableKey: "",
});
```

- This opens a new block of work. The lines underneath belong to this idea. `Object.freeze` means “lock this object so nobody changes it by accident.”
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This line continues the job from the nearby lines, keeping the data, HTML, or logic in order.
- This closes the piece of code that was opened just above.


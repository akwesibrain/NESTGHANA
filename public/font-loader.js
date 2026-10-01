const fontStylesheetPreload = document.querySelector("[data-font-stylesheet]");

if (fontStylesheetPreload) {
  const fontStylesheet = document.createElement("link");
  fontStylesheet.rel = "stylesheet";
  fontStylesheet.href = fontStylesheetPreload.href;
  document.head.append(fontStylesheet);
}

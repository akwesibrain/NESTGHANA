const configUrl = new URL("public/services-config.js", document.currentScript.src).href;
document.write(`<script src="${configUrl}"><\/script>`);

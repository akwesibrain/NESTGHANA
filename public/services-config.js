const DATA_SITE_URL = new URL("buy-data/index.html", window.location.href).href;

window.NESTGH_SERVICES_CONFIG = Object.freeze({
  DATA_SITE_URL,
  SERVICES: Object.freeze([
    Object.freeze({
      id: "data-bundles",
      label: "Buy Data",
      description: "Buy MTN, Telecel and AirtelTigo data",
      url: DATA_SITE_URL,
    }),
  ]),
});

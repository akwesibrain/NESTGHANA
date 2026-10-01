export function allowedCorsOrigin(origin, configuredOrigins) {
  if (!origin || !configuredOrigins) return null;
  let requested;
  try {
    requested = new URL(origin);
  } catch {
    return null;
  }
  const localHttp = requested.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(requested.hostname);
  if (requested.origin !== origin || (requested.protocol !== "https:" && !localHttp)) return null;
  const allowed = configuredOrigins.split(",").map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

import { listActivePackages } from "@/lib/server/data-bundles";
import { json } from "@/lib/server/http";

// Data bundles on sale, for the Buy Data page (/buy-data).
export async function GET() {
  try {
    return json({ packages: await listActivePackages() });
  } catch (error) {
    console.error("data_packages_failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Packages could not be loaded. Please try again." }, 500);
  }
}

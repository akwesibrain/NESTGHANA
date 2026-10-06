// Daily job: flags LIVE listings whose owners have not confirmed availability recently and queues
// a WhatsApp message (Admin → Messages) asking them to confirm.
//
//   npm run jobs:availability
//
// Schedule it once a day, e.g. Windows Task Scheduler running `npm run jobs:availability` in this
// folder, or cron on a server: `0 7 * * * cd /srv/nestgh && npm run jobs:availability`.
// Links in the messages use PUBLIC_SITE_URL (set it to the live site's https address).
import "dotenv/config";

async function main() {
  const { runAvailabilityCheck } = await import("@/lib/server/availability");
  const { getDb } = await import("@/lib/server/db");
  const baseUrl = (process.env.PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  try {
    const result = await runAvailabilityCheck(baseUrl);
    console.log(
      `Availability check (${result.confirmationDays}-day rule): ${result.checked} overdue, ${result.flagged} flagged and owners messaged` +
        (result.failures.length ? `, ${result.failures.length} failed` : "") + ".",
    );
    if (result.failures.length) process.exitCode = 1;
  } finally {
    await getDb().$disconnect();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

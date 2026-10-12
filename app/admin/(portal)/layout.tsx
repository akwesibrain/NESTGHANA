import type { ReactNode } from "react";
import { PortalFrame } from "@/app/admin/portal-frame";
import { requireAdmin } from "@/lib/server/admin-session";

// Every page in this group needs a signed-in, MFA-verified admin. Checking here (above the loading
// boundary) means a signed-out visitor gets a real redirect to the sign-in page, and the frame stays
// mounted while pages load inside it. Pages still check their own roles.
export default async function PortalLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return <PortalFrame admin={admin}>{children}</PortalFrame>;
}

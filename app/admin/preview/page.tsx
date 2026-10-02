import { notFound } from "next/navigation";
import AdminPreview from "./preview-client";

export default function AdminPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <AdminPreview />;
}

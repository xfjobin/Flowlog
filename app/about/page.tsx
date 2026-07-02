import { requireAuth } from "@/lib/require-auth";
import ClientAboutPage from "./ClientAboutPage";

export default async function AboutPage() {
  await requireAuth();
  return <ClientAboutPage />;
}

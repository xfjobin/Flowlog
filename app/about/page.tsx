import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientAboutPage from "./ClientAboutPage";

export default async function AboutPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  return <ClientAboutPage />;
}

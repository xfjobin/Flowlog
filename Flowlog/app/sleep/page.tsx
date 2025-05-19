import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientSleepPage from "./ClientSleepPage";

export default async function SleepPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  return <ClientSleepPage />;
}

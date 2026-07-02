import { requireAuth } from "@/lib/require-auth";
import ClientSleepPage from "./ClientSleepPage";

export default async function SleepPage() {
  await requireAuth();
  return <ClientSleepPage />;
}

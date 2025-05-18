import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientWorkPage from "./ClientWorkPage";

export default async function WorkPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  return <ClientWorkPage />;
}

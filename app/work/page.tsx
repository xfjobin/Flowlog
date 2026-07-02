import { requireAuth } from "@/lib/require-auth";
import ClientWorkPage from "./ClientWorkPage";

export default async function WorkPage() {
  await requireAuth();
  return <ClientWorkPage />;
}

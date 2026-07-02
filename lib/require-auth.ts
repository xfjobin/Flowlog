import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export async function requireAuth(): Promise<{ id: string; email: string; name?: string }> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return session.user as { id: string; email: string; name?: string };
}

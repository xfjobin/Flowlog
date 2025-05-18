import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("user_session");
  if (!session) return null;
  return session.value as unknown as number;
}

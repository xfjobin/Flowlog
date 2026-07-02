import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session");
    if (!session?.value) return null;

    const parsed = Number(session.value);
    if (isNaN(parsed)) return null;

    return parsed;
  } catch (error) {
    console.error("Failed to get current user ID:", error);
    return null;
  }
}

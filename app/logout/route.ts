import { NextResponse } from "next/server";

export async function POST() {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const callbackUrl = new URL("/login", baseUrl).toString();
  const signOutUrl = new URL(`/api/auth/signout`, baseUrl);
  signOutUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(signOutUrl.toString(), { status: 303 });
}

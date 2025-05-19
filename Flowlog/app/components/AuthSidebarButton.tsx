"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthSidebarButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (session?.user?.email) {
    // User is logged in
    return (
      <div className="mt-10">
        <span className="block text-white mb-2">{session.user.email}</span>
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            router.refresh();
          }}
          className="text-blue-500 hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  // User not logged in
  return (
    <div className="mt-10">
      <a href="/login" className="text-blue-500 hover:underline">
        Login
      </a>
    </div>
  );
}

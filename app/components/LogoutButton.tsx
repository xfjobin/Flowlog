"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition"
    >
      Logout
    </button>
  );
}

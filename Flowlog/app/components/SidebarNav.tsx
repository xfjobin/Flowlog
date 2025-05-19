"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function SidebarNav() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="block sm:hidden fixed bottom-4 left-4 z-50 p-3 bg-zinc-900 text-white rounded-full shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        {/* Hamburger Icon */}
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${
          open ? "block" : "hidden"
        } sm:hidden`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Drawer */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-4/5 max-w-xs p-6 text-sm bg-zinc-1000 z-50 transition-transform
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:block sm:w-48
        `}
        style={{ boxShadow: open ? "2px 0 10px rgba(0,0,0,0.2)" : undefined }}
      >
        {/* Close button (mobile only) */}
        <button
          className="sm:hidden absolute top-4 right-4 text-zinc-300"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="text-5xl font-bold text-white border-b-6 border-white inline-block pb-2 mb-20">
          Flowlog
        </div>
        <div className="text-xl font-bold text-white mb-6 space-y-2">
          <Link
            href="/"
            className="block transition-transform duration-200 hover:translate-x-2"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/work"
            className="block transition-transform duration-200 hover:translate-x-2"
            onClick={() => setOpen(false)}
          >
            Work
          </Link>
          <Link
            href="/sleep"
            className="block transition-transform duration-200 hover:translate-x-2"
            onClick={() => setOpen(false)}
          >
            Sleep
          </Link>
          <Link
            href="/about"
            className="block transition-transform duration-200 hover:translate-x-2"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <div className="mt-10">
            {status === "loading" ? (
              <span>Loading...</span>
            ) : session ? (
              <div>
                <span className="block mb-1 text-xs text-zinc-300 truncate">
                  {session.user?.email}
                </span>
                <button
                  className="text-red-400 hover:underline text-sm"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-blue-400 hover:underline text-sm"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

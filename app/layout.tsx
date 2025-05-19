import type { Metadata } from "next";
import "./globals.css";
import SidebarNav from "./components/SidebarNav";
import ClientSessionProvider from "./components/ClientSessionProvider";

export const metadata: Metadata = {
  title: "Flowlog",
  description: "Your personal productivity hub",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans bg-zinc-800 antialiased">
        <ClientSessionProvider>
          <div className="flex min-h-screen bg-zinc-900">
            <SidebarNav />
            <main className="flex-1 w-full p-4 sm:ml-48">{children}</main>
          </div>
        </ClientSessionProvider>
      </body>
    </html>
  );
}


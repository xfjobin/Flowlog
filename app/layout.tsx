import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Flowlog",
  description: "Your personal productivity hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className="font-sans bg-zinc-800 antialiased">
        <div className="flex min-h-screen bg-zinc-900">
          {/* Sidebar */}
          <nav className="w-48 p-6 text-sm text-zinc-300 bg-zinc-1000">
            <div className="text-5xl font-bold text-white border-b-6 border-white inline-block pb-2 mb-20">
              Flowlog
            </div>
            <div className="text-xl font-bold text-white mb-6 space-y-2">
              <a
                href="/"
                className="block transition-transform duration-200 hover:translate-x-2"
              >
                Home
              </a>
              <a
                href="/work"
                className="block transition-transform duration-200 hover:translate-x-2"
              >
                Work
              </a>
              <a
                href="/sleep"
                className="block transition-transform duration-200 hover:translate-x-2"
              >
                Sleep
              </a>
              <a
                href="/about"
                className="block transition-transform duration-200 hover:translate-x-2"
              >
                About
              </a>
            </div>
          </nav>

          {/* Main content area */}
          <main className="flex-1 p-10 flex justify-center items-start">
            <div className="w-full max-w-screen-lg bg-white rounded-2xl shadow-md p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

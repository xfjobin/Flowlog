import { getCurrentUserId } from '@/lib/auth';
import Link from 'next/link';


export default async function Home() {
  const userId = await getCurrentUserId();

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-semibold mb-4 tracking-tight">Flowlog</h1>
      <p className="text-lg text-zinc-600 mb-8">
        Your personal productivity hub — clean, simple, expandable.
      </p>

      {userId ? (
        <form action="/logout" method="post">
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition"
          >
            Logout
          </button>
        </form>
      ) : (
        <Link
          href="/login"
          className="px-6 py-2 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 transition"
        >
          Login
        </Link>
      )}
    </main>
  );
}
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';         // <-- Use NextAuth
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Call NextAuth signIn with credentials
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error || 'Login failed');
      return;
    }

    // On success, redirect to /work
    router.push('/work');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-8 text-zinc-900">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-zinc-700">
          Email
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </label>
        <label className="text-sm font-semibold text-zinc-700">
          Password
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 w-full border border-zinc-300 rounded px-3 py-2 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="mt-2 bg-zinc-900 text-white py-2 rounded font-semibold hover:bg-zinc-800 transition"
        >
          Login
        </button>
      </form>
      <button
        type="button"
        className="mt-4 w-full border border-zinc-300 text-zinc-900 py-2 rounded font-semibold hover:bg-zinc-100 transition"
        onClick={() => router.push('/register')}
      >
        Register
      </button>
    </div>
  );
}

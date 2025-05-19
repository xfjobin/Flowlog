'use client';

import { useState } from 'react';
import { registerUser } from '../actions/register';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = await registerUser(email, password);

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
      return;
    }

    setSuccessMsg('Account created! Redirecting...');
    setTimeout(() => router.push('/login'), 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-xl w-full max-w-sm shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">Create your account</h1>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />

        {errorMsg && <p className="text-red-400 text-sm mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-400 text-sm mb-2">{successMsg}</p>}

        <button
          type="submit"
          className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </main>
  );
}

'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, error: 'Invalid credentials' };
  }

  const cookieStore = await cookies(); // ✅ FIXED
  cookieStore.set('user_session', user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

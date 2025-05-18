'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function registerUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return { success: true };
}

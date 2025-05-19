import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies(); // ✅ await this

  cookieStore.set('user_session', '', {
    path: '/',
    maxAge: 0, // expires the cookie immediately
  });

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}

'use server';

// Authentication is handled by NextAuth via the /api/auth/[...nextauth] route.
// This file previously contained a custom login function that set an unsigned
// plain-text session cookie (user ID), which was vulnerable to session forgery.
// Use NextAuth's signIn() on the client instead.

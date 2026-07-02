---
name: testing-flowlog-auth
description: Test the Flowlog authentication flow end-to-end. Use when verifying auth, registration, login, logout, or session security changes.
---

## Local Dev Setup

1. Create `.env` in repo root (gitignored):
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="test-secret-for-local-dev-only"
   NEXTAUTH_URL="http://localhost:3000"
   ```
2. Run `npx prisma generate && npx prisma db push` to set up the SQLite DB.
3. Run `npm run dev` to start the dev server on `http://localhost:3000`.

## Architecture Notes

- **Auth system:** NextAuth v4 with JWT strategy + CredentialsProvider (bcrypt password hashing).
- **Auth config:** `app/api/auth/[...nextauth]/route.ts` exports `authOptions`.
- **Server-side auth helper:** `lib/auth.ts` has `getCurrentUserId()` which calls `getServerSession(authOptions)`.
- **Protected pages:** `/work` uses `getServerSession(authOptions)` directly; `/sleep`, `/about` use `getCurrentUserId()`. Both redirect to `/login` if no session.
- **Registration:** `app/actions/register.ts` — server action with email regex + min 8-char password validation.
- **Login page:** `app/login/page.tsx` — uses NextAuth's `signIn('credentials')`.
- **Logout:** Sidebar uses NextAuth's `signOut()`. The `/logout` POST route redirects to NextAuth signout.
- **Database:** SQLite via Prisma. Schema at `prisma/schema.prisma`.

## Key Test Scenarios

### Registration Validation
- Navigate to `/register`, enter short password (<8 chars), expect error "Password must be at least 8 characters."
- Enter valid email + password (8+ chars), expect success redirect to `/login`.

### Auth Protection
- Access `/sleep`, `/about`, `/work` while not logged in — all should redirect to `/login`.
- Log in via `/login`, then verify all three pages load their content.

### Cookie Forgery (Security)
- Log out, set `document.cookie = "user_session=1; path=/"` via browser console.
- Try accessing `/sleep` — should still redirect to `/login` (cookie is ignored since auth uses NextAuth JWT, not raw cookies).

### Logout
- Click Logout in sidebar → should redirect to `/login`.
- Try accessing `/work` after logout → should redirect to `/login`.

## Lint & Build

- Lint: `npx eslint app/ lib/` (note: `npm run lint` may fail due to Next.js 16 CLI arg parsing; use eslint directly)
- Build: `npm run build`
- TypeScript: `npx tsc --noEmit`

## CI Notes

- Vercel deployment might fail if `DATABASE_URL` and `NEXTAUTH_SECRET` env vars are not configured in the Vercel project settings.
- Both `main` and feature branches build successfully locally even when Vercel shows errors.

## Devin Secrets Needed

No external secrets required for local testing. The `.env` file uses local-only values (SQLite file DB, test secret).

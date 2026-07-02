---
name: testing-flowlog
description: Test the Flowlog Next.js app end-to-end. Use when verifying UI, auth, Work Tracker, or page rendering changes.
---

# Testing Flowlog

## Local Dev Setup

1. Create `.env` (not `.env.local` — Prisma CLI only reads `.env`):
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="test-secret-for-local-dev"
   ```
2. Run `npx prisma generate && npx prisma db push` to set up the SQLite database
3. Run `npm run dev` to start the dev server on port 3000

## Test Account

Register a new user at `/register` with any email/password. Login at `/login`.

## Key Pages to Test

| Page | URL | Auth Required | Key Components |
|------|-----|---------------|----------------|
| Work Tracker | `/work` | Yes (requireAuth) | TimePicker (x4), localStorage persistence, time calculations, PDF export |
| About | `/about` | Yes (requireAuth) | PageShell component |
| Sleep | `/sleep` | Yes (requireAuth) | PageShell component |
| Home | `/` | No | Session-aware (shows logout if authenticated) |
| Login | `/login` | No | NextAuth credentials provider |
| Register | `/register` | No | Creates user in SQLite DB |

## Testing the Work Tracker

The Work Tracker is the most complex page. Key things to verify:

1. **TimePicker dropdowns**: Should show 15-minute intervals (1:00 to 12:45) with AM/PM toggle
2. **"Use Today" button**: Sets date to current date
3. **Calculated Work Duration**: Appears after selecting Work Start + Work End. Formula: end - start - 30min lunch (if spans noon)
4. **Save Work Entry**: Stores to localStorage, shows alert "Work entry saved!"
5. **Saved Entries section**: Lists entries with formatted times (24h format via `to24HourFormat`)
6. **Summary stats**: "Total Work Hours" and "Total Travel Time" calculated from all entries
7. **Persistence**: Entries survive page refresh (loaded from localStorage)
8. **Clear All Entries**: Removes all entries from localStorage
9. **Download Weekly PDF**: Generates PDF with jsPDF (may need to verify download)

## Testing Auth Flow

1. **Login**: POST to NextAuth credentials provider at `/api/auth/callback/credentials`
2. **Logout**: Sidebar button posts to `/logout` which redirects to `/api/auth/signout`
3. **Auth guard**: Protected pages use `requireAuth()` which calls `getServerSession` and redirects to `/login` if no session

## Known Issues

- Vercel deployment might fail due to missing DATABASE_URL env var on Vercel (pre-existing)
- Login page doesn't always auto-redirect after successful signIn — may need to navigate manually
- Lunch deduction display message uses string comparison while calculation uses numeric (pre-existing edge case)

## Devin Secrets Needed

None required for local testing — the app uses SQLite and a hardcoded NEXTAUTH_SECRET for dev.

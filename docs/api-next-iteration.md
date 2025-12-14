## Iteration Goal
- Ship a minimal Nest API for nickname/password auth and posting.
- Remove frontend mocks: posts list, filters by authors/tags, post creation, auth.
- Business limits: post ≤ 240 chars; up to 5 tags; tag length ≤ 12 chars.

## Frontend Context
- Next.js App Router; all data currently mocked (`Post`, `Tag` from `@repo/types`).
- Sign-in/sign-up forms and UI for creating posts and filtering by authors/tags already exist.
- Filtering is local by `usernames`/`tags`; must move to API query params.

## Session/Auth Approach
- Primary: stateless JWT.
  - `accessToken` (15m) + `refreshToken` (7d) in httpOnly cookies (`Secure`, `SameSite=Lax`).
  - HS256, secret from env (`JWT_SECRET`); `JwtAuthGuard` on protected routes.
- Simpler fallback: in-memory/Redis session key if ever needed, but JWT covers current needs without extra storage.
- Google OAuth (server-side):
  - Flow: `GET /auth/google/start` → Google consent → `GET /auth/google/redirect` (handles code+PKCE), issues our access/refresh cookies, redirects to web.
  - Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.
  - User model stores `googleId`; password optional for social-only users.

## Models & Validation (backend)
- User: `id`, `name` (3–32, Latin/digits/_/-), `passwordHash`, `googleId?`, `createdAt`.
- Tag: `id`, `name` (1–12, unique case-insensitive).
- Post: `id`, `content` (1–240), `tags: Tag[]` (0–5), `authorId`, `createdAt`.
- DTOs:
  - `SignUpDto` { name: string; password: string (min 6–8 chars) }
  - `SignInDto` { name: string; password: string }
  - `CreatePostDto` { content: string; tagIds?: string[]; tagNames?: string[] }
    - `tagIds?.length + tagNames?.length <= 5`; backend creates new tags for `tagNames`.

## REST API (draft v1)
### Auth
- `POST /auth/sign-up`
  - body: `{ name, password }`
  - 201: `{ user: { id, name } }` + set-cookie access/refresh.
  - 409 user exists; 400 validation.
- `POST /auth/sign-in`
  - body: `{ name, password }`
  - 200: `{ user: { id, name } }` + set-cookie; 401 invalid creds.
- `POST /auth/refresh`
  - uses `refreshToken` cookie; 200 new cookies; 401/403 if invalid.
- `POST /auth/sign-out`
  - clears cookies; 200 `{ success: true }`.
- `GET /auth/me`
  - reads accessToken; 200 `{ user: { id, name } }`; 401 if no session.
- `GET /auth/google/start`
  - redirects to Google with state+PKCE; 302.
- `GET /auth/google/redirect`
  - handles Google code, upserts user by `googleId`, sets cookies, redirects to web (e.g., `/`).

### Posts
- `GET /posts`
  - query: `authorIds?=a1,a2` (or `authorNames` if easier), `tagIds?=t1,t2`, `limit` (10–50), `cursor` (id/createdAt).
  - sort: `createdAt desc` default; optional `sort=createdAt:asc`.
  - 200: `{ items: Post[]; nextCursor?: string; total?: number }`.
- `POST /posts` (auth required)
  - body: `{ content, tagIds?, tagNames? }`
  - returns created `Post`.
  - validations: content length, ≤5 tags, trim names, case-insensitive uniqueness.

### Tags
- `GET /tags`
  - query: `search?=fron`, `limit` (<=20).
  - 200: `{ items: Tag[] }`.

## Frontend Migration (off mocks)
- Swap local data for API calls:
  - posts list → `GET /posts` with `authorIds`/`tagIds` from filter modal;
  - post creation → `POST /posts`, send new tags in `tagNames`;
  - tag suggestions → `GET /tags?search=...`.
- Auth:
  - forms hit `/auth/sign-in|sign-up`; Google button → `/api/auth/google/start` redirect.
  - user state via `GET /auth/me`; logout via `/auth/sign-out`.
- Show `error` messages; on 401 for protected views, redirect to sign-in.

## Errors & Codes
- 400: validation (content >240, tag >12, >5 tags, empty name/password).
- 401: missing/bad token, wrong password.
- 403: modifying another user’s post (if we add PATCH/DELETE).
- 404: post/tag not found (for provided ids).
- 409: duplicate name (user or tag).

## Open Questions
- Do we need PATCH/DELETE for posts in this iteration?
- Is `createdAt` sorting enough, or do we need custom ordering by nickname/tag lists (currently treated as filtering)?
- Are spaces/Cyrillic allowed in nicknames and tags?
- Should tag creation be restricted to authenticated users?

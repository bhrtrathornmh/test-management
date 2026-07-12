# Preproute Test Management App

Frontend for the Preproute take-home assignment — login, dashboard, create/edit test, add questions, preview & publish.

## Stack

React + TypeScript on Vite. React Router for the pages, Zustand just for the auth session since that's the only real client state. Forms are React Hook Form + Zod. Tailwind for styling, Tiptap for the question rich-text editor, axios with a couple of interceptors for the auth header and 401 handling.

## Running it

```bash
npm install
npm run dev
npm run build
```

Dev server runs on **http://localhost:3000** — not Vite's default 5173. This isn't optional: the staging API's CORS setup only allows `http://localhost:3000` as an origin.

`.env` has `VITE_API_BASE_URL` pointing at the staging server already.

## Structure

- `api/` — axios setup + one file per resource
- `hooks/` — react-query hooks wrapping those
- `store/authStore.ts` — JWT + user, persisted
- `components/ui/` — Button/Input/Select/Modal/etc, the shared bits
- `features/` — one folder per page (auth, dashboard, test-form, questions, preview, tracking)

Dashboard wasn't in the Figma, so I built it to match the rest of the design system (same cards, badges, buttons).



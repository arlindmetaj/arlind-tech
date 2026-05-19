@AGENTS.md

# arlind-tech project rules

## Design system
- Always use CSS variables for colors — never hardcoded hex values:
  - `var(--ink)` — primary text
  - `var(--bg)` — page background
  - `var(--dim)` — secondary/muted text
  - `var(--line)` — borders and dividers
  - `var(--accent)` — highlight color
  - `var(--hi)` — highlight background
- Use `font-caveat` class on all page `<h1>` headings
- Inputs use `rounded-xl`, cards use `rounded-2xl`
- Spacing and layout must work on mobile, tablet and desktop

## Auth
- After a successful sign-in, always navigate with `window.location.href` — never `router.push()`. Using router.push causes Next.js server components to use stale cache and not pick up the new session cookie.

## API routes
- Every `/app/api/*` route must use `apiFetch` + `proxy` from `@/lib/api`
- Never call the arlind-api backend directly from client components — always go through the Next.js proxy routes

## New dashboard sections
- Pages live at `app/w/[section]/page.tsx`
- Add the section to the sidebar in `components/Sidebar.tsx` (import icon from lucide-react, add to `privateNav` array)
- Create corresponding API proxy routes under `app/api/[section]/`

## Git commits
- Never include `Co-Authored-By` lines in commit messages

## Deployment
- This project has two separate services: `arlind-tech` (frontend) and `arlind-api` (backend)
- Changes to `prisma/schema.prisma` in arlind-api require redeploying `arlind-api` — redeploying `arlind-tech` alone does nothing to the database
- Always tell the user which service(s) need to be redeployed after a change

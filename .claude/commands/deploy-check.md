Check what has changed and tell the user exactly which services need to be redeployed in Coolify.

Run the following and analyse the output:

```bash
git diff --name-only origin/main..HEAD 2>/dev/null || git diff --name-only HEAD~1..HEAD
```

Then apply these rules:

## arlind-tech (Frontend) needs redeploying if any of these changed:
- `app/` — any page or API route
- `components/` — any component
- `lib/` — any helper
- `public/` — static assets
- `CLAUDE.md`, `AGENTS.md`
- `next.config.*`, `tailwind.config.*`, `tsconfig.json`, `package.json`

## arlind-api (Backend) needs redeploying if any of these changed:
- `prisma/schema.prisma` — **schema change: database migration will run on deploy**
- `src/` — any backend route or middleware
- `entrypoint.sh`
- `package.json`, `tsconfig.json`

## Output format
Respond with a clear summary like:

---
**Deploy checklist:**
- [ ] `arlind-tech` — redeploy in Coolify (UI changes detected)
- [ ] `arlind-api` — redeploy in Coolify ⚠️ schema changed, migration will run

or

- [x] `arlind-tech` — nothing changed, skip
- [x] `arlind-api` — nothing changed, skip
---

If `prisma/schema.prisma` changed, always add a warning:
> ⚠️ Schema changed — redeploy `arlind-api` BEFORE `arlind-tech` so the database is ready when the frontend goes live.

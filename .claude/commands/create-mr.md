Create a GitHub Pull Request for the current branch. $ARGUMENTS (optional: custom title or notes).

Follow these steps:

## 1. Gather context
Run these in parallel:
```bash
git status
git log --oneline origin/main..HEAD
git diff origin/main..HEAD
```

## 2. Check branch
If already on `main`, tell the user:
> You're on `main` — create a feature branch first with `git checkout -b your-branch-name`, then run this command again.
Stop here if on main.

## 3. Push branch
```bash
git push -u origin HEAD
```

## 4. Draft PR title and body
- Title: short, under 70 chars, imperative ("Add journal section", "Fix goals 500 error")
- Body: use this template:

```
## What changed
<bullet points of what was added/changed/fixed>

## Services to redeploy
- [ ] `arlind-tech`
- [ ] `arlind-api`
(check which ones apply based on the diff)

## Test plan
- [ ] Tested locally at localhost:3000
- [ ] No TypeScript errors
- [ ] Looks correct on mobile
```

## 5. Create the PR
```bash
gh pr create --title "<title>" --body "<body>" --base main
```

## 6. Return the PR URL to the user.

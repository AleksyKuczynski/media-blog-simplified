# Contributing to event4me

## Branch Strategy

```
feature/xxx  →  PR → dev  →  auto-deploys dev.event4me.vip
                PR → qa   →  auto-deploys qa.event4me.vip
                PR → main →  auto-deploys event4me.vip
```

Long-lived branches map 1:1 to environments. **Never commit directly to `dev`, `qa`, or `main`.**

---

## Starting New Work

Always branch from `dev`:

```bash
git checkout dev
git pull
git checkout -b feature/your-description
```

Branch naming: `feature/`, `fix/`, `chore/` — kebab-case, concise.  
Example: `feature/article-limit-env`, `fix/breadcrumb-searchparams`

---

## Daily Workflow

1. Commit often with meaningful messages:
   - `fix: move searchParams to client component`
   - `feat: add ARTICLES_LIMIT env var support`
   - `chore: update CONTRIBUTING.md`

2. Push your branch:
   ```bash
   git push -u origin feature/your-description
   ```

3. Open a Pull Request **into `dev`** on GitHub.

---

## Promotion Path

| Step | Action | Result |
|------|--------|--------|
| 1 | PR `feature/x` → `dev` | Deploys to `dev.event4me.vip` — smoke test |
| 2 | PR `dev` → `qa` | Deploys to `qa.event4me.vip` — QA review |
| 3 | PR `qa` → `main` | Deploys to `event4me.vip` — production |

- PRs `dev → qa` and `qa → main` are opened only when the previous stage is stable.
- QA files issues against `qa.event4me.vip`. Fixes go back to a new `fix/` branch off `dev` and follow the same path.

---

## What NOT to Do

- ❌ `git push` directly to `dev`, `qa`, or `main`
- ❌ Start a feature branch from `main` or `qa`
- ❌ Merge `main` back into `dev` (use `git rebase dev` if your branch is stale)
- ❌ Force-push to any long-lived branch

---

## Keeping Your Branch Up to Date

If `dev` has moved on while you were working:

```bash
git fetch origin
git rebase origin/dev
```

Resolve conflicts if any, then `git push --force-with-lease` (safe force-push — aborts if someone else pushed).

---

## Environment Variables

Each environment has its own `.env` file on the server (never committed).  
`.env.example` in the repo documents all required keys.  
`ARTICLES_LIMIT` controls how many articles are fetched per environment (unset = unlimited on prod).
# 🔐 Git Collaboration Workflow Guide

## 👥 Team Structure

- **Talha**: Repo owner, does 80% of work, merges to `main`
- **Bilal**: Collaborator, does 20% of work, never pushes to `main`

---

## ✅ STEP 0 — ONE-TIME IDENTITY SETUP (COMPLETED)

### ✅ TALHA (Done)
```bash
git config --global user.name "Talha"
git config --global user.email "talha@yourmail.com"
```

### 📋 BILAL (Run this on his machine)
```bash
git config --global user.name "Bilal"
git config --global user.email "bilal@yourmail.com"
```

---

## ✅ STEP 1 — CREATE & PUSH dev (COMPLETED)

### ✅ TALHA (Done)
```bash
git checkout main
git pull origin main
git checkout -b dev
git push origin dev
```

**Status**: ✅ `dev` branch created and pushed to GitHub

---

## 📋 STEP 2 — BILAL SYNC WITH dev

### 🧑‍💻 BILAL (Run this now)

```bash
git fetch origin
git checkout dev
git pull origin dev
```

**After this**: Bilal will be on `dev` branch and ready to work.

---

## 🔄 STEP 3 — DAILY WORK START (EVERY DAY)

### 🧑‍💻 TALHA

```bash
git checkout dev
git pull origin dev
git checkout -b talha/feature-name
```

**Example**:
```bash
git checkout -b talha/mobile-responsive
git checkout -b talha/sitemap-fix
git checkout -b talha/tour-options
```

### 🧑‍💻 BILAL

```bash
git checkout dev
git pull origin dev
git checkout -b bilal/feature-name
```

**Example**:
```bash
git checkout -b bilal/ui-improvements
git checkout -b bilal/bug-fix
```

---

## 💻 STEP 4 — WORK & COMMIT

### 🧑‍💻 TALHA

```bash
# Make your changes...
git add .
git commit -m "fix(server): clear message"
```

**Commit Message Format**:
- `feat(area): description` - New feature
- `fix(area): description` - Bug fix
- `docs(area): description` - Documentation
- `style(area): description` - Formatting
- `refactor(area): description` - Code restructuring

**Examples**:
```bash
git commit -m "feat(mobile): add responsive styles for home page"
git commit -m "fix(sitemap): use www domain and correct content-type"
git commit -m "docs(readme): add collaboration workflow guide"
```

### 🧑‍💻 BILAL

```bash
# Make your changes...
git add .
git commit -m "feat(ui): clear message"
```

---

## 📤 STEP 5 — PUSH YOUR BRANCH

### 🧑‍💻 TALHA

```bash
git push origin talha/feature-name
```

### 🧑‍💻 BILAL

```bash
git push origin bilal/feature-name
```

---

## 🔀 STEP 6 — PULL REQUEST (GITHUB UI)

1. Go to: https://github.com/txlcodes/asiabylocals
2. Click: **"Pull requests"** → **"New pull request"**
3. **Base branch**: `dev`
4. **Compare branch**: `talha/feature-name` or `bilal/feature-name`
5. **Title**: Clear description (e.g., "Mobile responsive home page")
6. **Description**: What changed and why
7. **Reviewer**: Assign the other person
8. **Click**: "Create pull request"

### Review Process

- **Reviewer** checks the code
- **Reviewer** approves or requests changes
- **Author** addresses feedback if needed
- **Reviewer** merges PR into `dev`

---

## 🚀 STEP 7 — RELEASE TO main (ONLY TALHA)

### 🧑‍💻 TALHA (When ready to release)

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

**When to do this**:
- After testing `dev` branch
- Before deploying to production
- When features are stable

### ❌ BILAL NEVER PUSHES TO main

Only Talha merges `dev` → `main`.

---

## 🚨 STOP CONDITIONS (IMPORTANT)

If you see any of these, **STOP IMMEDIATELY**:

- ❌ `merge conflicts`
- ❌ `rebase prompts`
- ❌ `diverged branches`
- ❌ `detached HEAD`
- ❌ `cannot fast-forward`

**What to do**:
1. **STOP** what you're doing
2. Copy the terminal output
3. Share it with the team
4. Wait for help before proceeding

---

## 🧠 NON-NEGOTIABLE RULES

1. ✅ **One feature → one branch**
   - Don't mix multiple features in one branch
   - Create separate branches for each feature

2. ✅ **One PR → one reviewer**
   - Always get code review before merging
   - Don't merge your own PRs

3. ✅ **AI never touches files outside owner's area**
   - Talha's features → Talha's commits
   - Bilal's features → Bilal's commits

4. ✅ **No direct push to main**
   - Always go through `dev` branch
   - Only Talha merges `dev` → `main`

5. ✅ **Always pull before starting work**
   ```bash
   git checkout dev
   git pull origin dev
   ```

6. ✅ **Commit often, push regularly**
   - Don't wait days to commit
   - Push your branch daily

---

## 📊 Branch Structure

```
main (production-ready)
  └── dev (integration branch)
       ├── talha/feature-1
       ├── talha/feature-2
       ├── bilal/feature-1
       └── bilal/feature-2
```

---

## 🎯 Quick Reference

### Daily Start (Both)
```bash
git checkout dev
git pull origin dev
git checkout -b your-name/feature-name
```

### After Work (Both)
```bash
git add .
git commit -m "type(area): description"
git push origin your-name/feature-name
```

### Create PR (Both)
- GitHub UI → New PR → Base: `dev` → Compare: `your-branch`

### Release (Talha Only)
```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

---

## ✅ Current Status

- ✅ Talha identity configured
- ✅ `dev` branch created and pushed
- ✅ `main` branch up to date
- 📋 Bilal needs to run STEP 2

---

## 🆘 Need Help?

If you encounter any issues:
1. Check this guide first
2. Check Git status: `git status`
3. Check branches: `git branch -a`
4. Share terminal output for help

---

**Last Updated**: January 24, 2025  
**Status**: ✅ Setup Complete - Ready for Collaboration


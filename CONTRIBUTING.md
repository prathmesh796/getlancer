# Contributing to getLancer

Thank you for your interest in contributing! This guide will walk you through everything you need to know to get started.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Branching Strategy](#branching-strategy)
6. [Commit Message Guidelines](#commit-message-guidelines)
7. [Submitting a Pull Request](#submitting-a-pull-request)
8. [Reporting Bugs](#reporting-bugs)
9. [Requesting Features](#requesting-features)
10. [Style Guide](#style-guide)

---

## Code of Conduct

Be respectful and constructive. Harassment of any kind will not be tolerated. By participating you agree to treat every contributor with dignity.

---

## Getting Started

### 1. Fork and clone the repository

```bash
# Fork via GitHub UI, then:
git clone https://github.com/<your-username>/getlancer.git
cd getlancer
```

### 2. Add the upstream remote

```bash
git remote add upstream https://github.com/prathmesh796/getlancer.git
```

### 3. Set up your local environment

Follow the full setup instructions in [README.md](README.md), including:

- Installing Node.js dependencies (`npm install`)
- Copying `.env.example` to `.env.local` and filling in all required variables

### 4. Verify the setup

```bash
npm run dev
```

Navigate to `http://localhost:3000` and confirm the app loads correctly.

---

## Project Structure

```
getlancer/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Server-side API route handlers
│   └── (Auth)/           # Auth-related pages (login, signup)
├── components/           # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Third-party client initialisation (Firebase, etc.)
├── models/               # Mongoose database models
├── public/               # Static assets
├── services/             # Business-logic / service layer
├── utils/                # Shared utility functions (DB connection, helpers)
├── .env.example          # Example environment variables
├── next.config.mjs       # Next.js configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

---

## Development Workflow

1. **Sync with upstream** before starting any work:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch** (see [Branching Strategy](#branching-strategy)).

3. **Make your changes**, keeping commits small and focused.

4. **Lint your code** before pushing:

   ```bash
   npm run lint
   ```

5. **Run the development server** to manually verify your changes:

   ```bash
   npm run dev
   ```

6. **Build the project** to catch compile-time errors:

   ```bash
   npm run build
   ```

7. **Push your branch** and open a Pull Request.

---

## Branching Strategy

| Branch prefix | When to use |
|---|---|
| `feat/` | New features (e.g. `feat/calendar-reminders`) |
| `fix/` | Bug fixes (e.g. `fix/login-redirect-loop`) |
| `docs/` | Documentation-only changes |
| `chore/` | Dependency updates, config changes |
| `refactor/` | Code refactoring without behaviour changes |

Branch names should be lowercase and use hyphens, not underscores.

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**

```
<type>(<scope>): <short summary>
```

**Examples:**

```
feat(auth): add GitHub OAuth login
fix(profile): prevent crash when avatar URL is null
docs(readme): update installation steps
chore(deps): bump next to v15.1.0
```

**Rules:**

- Use the **imperative mood** in the summary ("add", not "added" or "adds").
- Keep the summary under **72 characters**.
- Reference related issues in the commit body: `Closes #42`.

---

## Submitting a Pull Request

1. Push your branch to your fork:

   ```bash
   git push origin feat/your-feature-name
   ```

2. Open a Pull Request against the `main` branch of `prathmesh796/getlancer`.

3. Fill in the PR template:
   - **What** was changed and **why**
   - Steps to reproduce / test the change
   - Screenshots or screen recordings for UI changes

4. Make sure:
   - [ ] `npm run lint` passes with no errors
   - [ ] `npm run build` completes successfully
   - [ ] No secrets or credentials are committed
   - [ ] `.env.example` is updated if you added new environment variables

5. Respond to review feedback promptly. Once approved, a maintainer will merge your PR.

---

## Reporting Bugs

Use the [GitHub Issues](https://github.com/prathmesh796/getlancer/issues) tracker.

When filing a bug report, please include:

- A **clear, descriptive title**
- Steps to **reproduce** the issue
- **Expected** vs **actual** behaviour
- Your **environment** (OS, Node.js version, browser)
- Relevant **error messages** or screenshots

---

## Requesting Features

Open a [GitHub Issue](https://github.com/prathmesh796/getlancer/issues) and use the **Feature Request** label.

Describe:

- The problem you're trying to solve
- Your proposed solution (optional)
- Any alternatives you considered

---

## Style Guide

### JavaScript / React

- Use **ES Modules** (`import`/`export`), not CommonJS (`require`).
- Prefer **functional components** with hooks over class components.
- Use **named exports** for components; default exports are acceptable for pages.
- Keep components **small and focused** — split large files into smaller ones.

### CSS / Tailwind

- Use **Tailwind utility classes** directly in JSX.
- Avoid writing custom CSS unless Tailwind cannot achieve the desired result.
- Keep class lists readable — one logical group per line is encouraged for long lists.

### API Routes (Next.js App Router)

- Place all API handlers under `app/api/`.
- Always return a proper HTTP status code alongside JSON responses.
- Validate and sanitise all user-supplied input before use.
- Do **not** expose internal error messages or stack traces to the client.

### Environment Variables

- Prefix client-side variables with `NEXT_PUBLIC_`.
- Never hard-code secrets — always read them from `process.env`.
- Add any new variable to `.env.example` with a descriptive comment.

---

Thank you for contributing to getLancer! 🚀

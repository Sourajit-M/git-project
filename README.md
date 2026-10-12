# GitAI Hub — Intelligent Git & Release Assistant

A developer productivity platform that automates commit messages, pull request documentation, and changelog generation using AI, GitHub OAuth2, Redis caching, and PostgreSQL.

---

## 📐 Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons (in `/frontend`)
- **Backend**: Node.js, Express, TypeScript, Groq AI (`llama-3.3-70b-versatile`), Prisma ORM, Redis (in `/backend`)
- **Data & Caching**: PostgreSQL (Users + Generation History) & Redis (Sliding TTL prompt cache)
- **GitHub Integration**: GitHub OAuth2 & REST API v3

---

## 🚀 Key Features

1. **GitHub Authentication**: OAuth2 sign-in & secure connection.
2. **Repository Dashboard**: Centralized management of GitHub repositories and branch workflows.
3. **AI Commit Message Generator**: Syntax-highlighted diff analysis generating Conventional Commits with alternative options and one-click CLI commands.
4. **Pull Request Descriptions**: Branch comparison to produce structured PR markdown (Summary, Changes, Rationale, Testing checklist).
5. **Release Notes Generator**: Converts commit ranges into categorized release notes.
6. **History & Caching Layer**: Redis caching for fast repeated generations and PostgreSQL audit history.

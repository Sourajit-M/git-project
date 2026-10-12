# GitAI Hub — React + Tailwind Frontend

A professional developer platform for AI-assisted Git workflows, built with **React 18**, **TypeScript**, and **Tailwind CSS**. Designed directly according to the project architecture diagram to integrate with a **Spring Boot REST API** backed by **GitHub OAuth2**, **AI Prompting Services**, **PostgreSQL**, and **Redis**.

---

## 🚀 Features Implemented

1. **GitHub Authentication (`OAuth2`)**
   - Active profile display, avatar, account details, and connection status.
   - Ready for Spring Boot OAuth2 code flow (`/oauth2/authorization/github`).

2. **Repository Dashboard**
   - Central hub displaying all repositories with search, visibility filters (`public` / `private`), branch pickers, star counts, and quick-action launcher cards.

3. **AI Commit Message Generator**
   - Visual Git diff syntax highlighting (`+` additions in green, `-` deletions in red, hunk headers).
   - Generates Conventional Commits (type, scope, breaking changes, bullet explanation).
   - Formats supported: Conventional Commits, Gitmoji, Concise one-liner, and Detailed.
   - Provides alternative suggestions and a one-click `git commit -m "..."` copy command.

4. **Pull Request Descriptions**
   - Branch comparison inputs (`base` branch vs. `compare` branch).
   - Structured PR generation: Summary, Key Changes, Rationale, and Testing checklists (`[x]`).
   - Tabbed view: Formatted Markdown preview and raw markdown editor.

5. **Release Notes Generator**
   - Transforms commit ranges and logs into categorized publication-ready release notes.
   - Categorizes into Features, Bug Fixes, Performance, and Maintenance.
   - Markdown export and direct copy button.

6. **History & Caching (PostgreSQL + Redis)**
   - Tracks all generations with Redis cache indicators (`Redis Hit`).
   - Searchable history log with one-click output retrieval and persistence.

7. **Interactive Architecture Inspector**
   - Visual map matching the architecture diagram:
     - `React + Tailwind frontend` (Dashboard · Diff input · Generated output)
     - `Spring Boot REST API` (Security · Validation · Business logic)
     - `GitHub service` (OAuth2 + repository data)
     - `AI service` (Prompting + generation)
     - `PostgreSQL` (Users + history)
     - `Redis` (Caching)
   - Real-time backend ping check button for `localhost:8080`.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```

---

## 🔄 Demo Mode vs. Live Spring Boot Mode

The top navigation bar features a **Mode Switch**:
- **Demo Mode (Default)**: Test the entire frontend immediately with rich mock repositories, interactive diffs, and simulated AI responses without needing backend servers running.
- **Spring API Mode**: Directly routes requests through the Vite proxy (`/api/v1`) to `http://localhost:8080` where your Spring Boot backend runs.

import { UserProfile } from '../types/auth';
import { Repository } from '../types/repo';
import { GenerationHistoryItem } from '../types/generator';

export const MOCK_USER: UserProfile = {
  id: 'gh-948123',
  username: 'Sourajit-M',
  name: 'Sourajit M',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'sourajit.dev@example.com',
  htmlUrl: 'https://github.com/Sourajit-M',
  publicRepos: 12,
  privateRepos: 4,
  createdAt: '2023-04-12T10:00:00Z',
  token: 'gho_mock_oauth_token_718293021948',
  connectedAt: '2026-10-13T00:00:00Z',
};

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: 101,
    name: 'git-project',
    fullName: 'Sourajit-M/git-project',
    description: 'AI-assisted developer platform for Git commits, PR descriptions, and release changelogs using Groq and Redis.',
    isPrivate: false,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/Sourajit-M/git-project',
    language: 'TypeScript',
    starsCount: 142,
    forksCount: 28,
    updatedAt: new Date().toISOString(),
    openIssuesCount: 2,
    branches: ['main', 'feat/groq-llama3', 'fix/redis-sliding-ttl', 'release/v1.0.0'],
  },
  {
    id: 102,
    name: 'ecommerce-payment-gateway',
    fullName: 'Sourajit-M/ecommerce-payment-gateway',
    description: 'Stripe and PayPal multi-tenant payment processor with webhook idempotency.',
    isPrivate: true,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/Sourajit-M/ecommerce-payment-gateway',
    language: 'Node.js',
    starsCount: 67,
    forksCount: 12,
    updatedAt: '2026-10-11T14:32:00Z',
    openIssuesCount: 1,
    branches: ['main', 'feat/stripe-v3-migration', 'hotfix/webhook-retry'],
  },
  {
    id: 103,
    name: 'developer-portal-ui',
    fullName: 'Sourajit-M/developer-portal-ui',
    description: 'Modern developer documentation and API playground built with React, Tailwind CSS, and Vite.',
    isPrivate: false,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/Sourajit-M/developer-portal-ui',
    language: 'TypeScript',
    starsCount: 95,
    forksCount: 18,
    updatedAt: '2026-10-08T11:20:00Z',
    openIssuesCount: 2,
    branches: ['main', 'v2-redesign', 'chore/tailwind-upgrade'],
  },
];

export const SAMPLE_DIFFS = {
  feature: `diff --git a/src/services/aiService.ts b/src/services/aiService.ts
index 4b8251e..a7e129b 100644
--- a/src/services/aiService.ts
+++ b/src/services/aiService.ts
@@ -10,6 +10,18 @@ export class GroqAiService {
+    async generateCommitMessage(diff: string, scope: string) {
+        const cacheKey = \`ai:commit:\${hash(diff + scope)}\`;
+        const cached = await redisCacheService.get(cacheKey);
+        if (cached) return { ...cached, cachedInRedis: true };
+
+        const completion = await groqClient.chat.completions.create({
+            model: "llama-3.3-70b-versatile",
+            messages: [{ role: "user", content: buildPrompt(diff, scope) }],
+            response_format: { type: "json_object" }
+        });
+        
+        const result = JSON.parse(completion.choices[0].message.content);
+        await redisCacheService.set(cacheKey, result, 45 * 60);
+        return result;
+    }
 }`,

  bugfix: `diff --git a/src/services/redisCacheService.ts b/src/services/redisCacheService.ts
index 891f7c2..c1839ea 100644
--- a/src/services/redisCacheService.ts
+++ b/src/services/redisCacheService.ts
@@ -15,7 +15,7 @@ export const redisCacheService = {
     async get<T>(key: string): Promise<T | null> {
         try {
             const data = await redis.get(key);
-            if (!data) return null;
+            if (!data || data === '{}') return null;
             // Refresh sliding TTL on cache hit to 45 minutes
+            await redis.expire(key, 45 * 60);
             return JSON.parse(data) as T;
         } catch (err) {
-            console.error(err);
+            console.warn("[Redis] Deserialization fallback for key:", key);
             return null;
         }
     }
 }`,

  refactor: `diff --git a/src/controllers/aiController.ts b/src/controllers/aiController.ts
index 102e3b1..92bfe88 100644
--- a/src/controllers/aiController.ts
+++ b/src/controllers/aiController.ts
@@ -12,8 +12,12 @@ export const aiController = {
-    async generateCommit(req: Request, res: Response) {
-        const result = await aiService.generate(req.body.diff);
+    async generateCommit(req: Request, res: Response) {
+        const validated = commitRequestSchema.parse(req.body);
+        const result = await aiService.generateCommitMessage(validated);
+        await historyService.recordHistory({
+            type: "commit",
+            title: result.title,
+            output: result.primaryMessage
+        });
         res.json(result);
     }
 }`
};

export const SAMPLE_COMMITS_FOR_RELEASE = `feat(ai): integrate Groq Cloud SDK with llama-3.3-70b-versatile (#10)
feat(cache): implement Redis sliding TTL expiration for prompt responses (#12)
feat(db): configure Docker PostgreSQL with Prisma ORM migrations (#14)
feat(github): add branch diff comparator and repository viewer (#16)
fix(redis): prevent unhandled rejection during connection retry backoff (#18)
fix(api): sanitize raw diff input before dispatching to LLM prompts (#19)
perf(cache): SHA-256 hash prompt inputs for instant sub-10ms cache hits (#21)
refactor(controller): transition Express routes to Zod schema validation (#22)
chore(deps): upgrade Groq SDK to 0.15.0 and Prisma to 6.4.1 (#25)`;

export const INITIAL_HISTORY: GenerationHistoryItem[] = [
  {
    id: 'gen-8831',
    type: 'commit',
    title: 'feat(ai): integrate Groq SDK with llama-3.3-70b-versatile and Redis caching',
    preview: 'feat(ai): integrate Groq SDK with llama-3.3-70b-versatile and Redis caching\n\n- Connect Groq chat completions in JSON schema mode\n- Hash input diff with SHA-256 for Redis cache lookups\n- Fall back gracefully when API key is unconfigured',
    timestamp: '10 minutes ago',
    cached: true,
    repoName: 'git-project',
    fullOutput: 'feat(ai): integrate Groq SDK with llama-3.3-70b-versatile and Redis caching\n\n- Connect Groq chat completions in JSON schema mode\n- Hash input diff with SHA-256 for Redis cache lookups\n- Fall back gracefully when API key is unconfigured',
  },
  {
    id: 'gen-8830',
    type: 'pr',
    title: 'PR: Redis sliding TTL expiration & Groq prompt engineering',
    preview: '## Summary\nTransitions AI generation to Groq high-speed inference with Redis 45-minute sliding TTL cache.',
    timestamp: '1 hour ago',
    cached: false,
    repoName: 'git-project',
    fullOutput: `## Summary
Transitions AI generation to Groq high-speed inference with Redis 45-minute sliding TTL cache.

## Changes Made
- Implement 45-minute sliding TTL refresh on every cache hit
- Connect Groq Cloud API with \`llama-3.3-70b-versatile\`
- Add fallback parsing when cache payload is empty or invalid

## Rationale
Eliminates duplicate LLM calls for repeated diff comparisons and reduces response latency from 1.5s to < 10ms.

## Testing & Verification
- [x] Verified unit tests for cache hits and misses
- [x] Tested with Docker PostgreSQL and Redis
- [x] Validated JSON schema response parser`,
  },
  {
    id: 'gen-8829',
    type: 'release',
    title: 'Release Notes: v1.0.0 — Groq AI Engine & Redis Caching',
    preview: '## What\'s New in v1.0.0\nInitial production release featuring Groq AI acceleration, Docker PostgreSQL persistence, and Redis caching.',
    timestamp: 'Yesterday',
    cached: true,
    repoName: 'git-project',
    fullOutput: `## Release v1.0.0 (2026-10-13)

### ✨ Features
- **Groq AI Acceleration**: Sub-second commit and PR generation using \`llama-3.3-70b-versatile\` (#10)
- **Redis Sliding Cache**: Cache AI generation responses with automatic 45-min TTL sliding renewals (#12)
- **PostgreSQL Persistence**: Full audit history with Prisma ORM in Docker (#14)

### 🐛 Bug Fixes
- **Diff Sanitization**: Sanitize huge multi-file patches before dispatching to LLM prompts (#19)
- **Safe Deserialization**: Prevent crashes when encountering corrupted Redis cache values (#18)

### ⚡ Performance
- **Instant Cache Hits**: Sub-10ms response times for repeated diff queries (#21)

---
*Generated by GitAI Assistant via Groq & Redis*`,
  },
];

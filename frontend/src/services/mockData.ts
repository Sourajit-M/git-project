import { UserProfile } from '../types/auth';
import { Repository } from '../types/repo';
import { GenerationHistoryItem } from '../types/generator';

export const MOCK_USER: UserProfile = {
  id: 'gh-948123',
  username: 'sourav-dev',
  name: 'Sourav Roy',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'sourav.dev@example.com',
  htmlUrl: 'https://github.com/sourav-dev',
  publicRepos: 18,
  privateRepos: 6,
  createdAt: '2023-04-12T10:00:00Z',
  token: 'gho_mock_oauth_token_718293021948',
  connectedAt: '2026-10-12T04:20:00Z',
};

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: 101,
    name: 'spring-cloud-auth',
    fullName: 'sourav-dev/spring-cloud-auth',
    description: 'OAuth2 and JWT authentication service built with Spring Boot 3, Redis caching, and PostgreSQL.',
    isPrivate: true,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/sourav-dev/spring-cloud-auth',
    language: 'Java',
    starsCount: 42,
    forksCount: 9,
    updatedAt: '2026-10-11T14:32:00Z',
    openIssuesCount: 3,
    branches: ['main', 'feat/oauth2-github', 'fix/redis-ttl-leak', 'release/v1.4.0'],
  },
  {
    id: 102,
    name: 'git-ai-assistant',
    fullName: 'sourav-dev/git-ai-assistant',
    description: 'AI-assisted developer workflow for commits, PR descriptions, and release notes automation.',
    isPrivate: false,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/sourav-dev/git-ai-assistant',
    language: 'TypeScript',
    starsCount: 128,
    forksCount: 34,
    updatedAt: '2026-10-12T08:15:00Z',
    openIssuesCount: 5,
    branches: ['main', 'feat/diff-syntax-highlight', 'feat/pr-generator-ui'],
  },
  {
    id: 103,
    name: 'ecommerce-payment-gateway',
    fullName: 'sourav-dev/ecommerce-payment-gateway',
    description: 'Stripe and PayPal multi-tenant payment processor with webhook idempotency.',
    isPrivate: true,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/sourav-dev/ecommerce-payment-gateway',
    language: 'Kotlin',
    starsCount: 67,
    forksCount: 12,
    updatedAt: '2026-10-09T18:40:00Z',
    openIssuesCount: 1,
    branches: ['main', 'feat/stripe-v3-migration', 'hotfix/webhook-retry'],
  },
  {
    id: 104,
    name: 'developer-portal-ui',
    fullName: 'sourav-dev/developer-portal-ui',
    description: 'Modern developer documentation and API playground built with React, Tailwind CSS, and Vite.',
    isPrivate: false,
    defaultBranch: 'main',
    htmlUrl: 'https://github.com/sourav-dev/developer-portal-ui',
    language: 'TypeScript',
    starsCount: 95,
    forksCount: 18,
    updatedAt: '2026-10-08T11:20:00Z',
    openIssuesCount: 2,
    branches: ['main', 'v2-redesign', 'chore/tailwind-v3-upgrade'],
  },
];

export const SAMPLE_DIFFS = {
  feature: `diff --git a/src/main/java/com/gitai/service/GitHubAuthService.java b/src/main/java/com/gitai/service/GitHubAuthService.java
index 4b8251e..a7e129b 100644
--- a/src/main/java/com/gitai/service/GitHubAuthService.java
+++ b/src/main/java/com/gitai/service/GitHubAuthService.java
@@ -15,6 +15,14 @@ public class GitHubAuthService {
     private final RestTemplate restTemplate;
     private final RedisTemplate<String, Object> redisTemplate;
 
+    @Value("\${github.client.id}")
+    private String clientId;
+
+    @Value("\${github.client.secret}")
+    private String clientSecret;
+
     public OAuthTokenResponse exchangeCodeForToken(String code) {
-        // TODO: implement exchange code logic
-        return null;
+        HttpHeaders headers = new HttpHeaders();
+        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
+        Map<String, String> body = Map.of(
+            "client_id", clientId,
+            "client_secret", clientSecret,
+            "code", code
+        );
+        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
+        ResponseEntity<OAuthTokenResponse> response = restTemplate.postForEntity(
+            "https://github.com/login/oauth/access_token",
+            request,
+            OAuthTokenResponse.class
+        );
+        
+        OAuthTokenResponse token = response.getBody();
+        if (token != null && token.getAccessToken() != null) {
+            redisTemplate.opsForValue().set("oauth:session:" + token.getAccessToken(), token, Duration.ofHours(24));
+        }
+        return token;
     }
 }`,

  bugfix: `diff --git a/src/main/java/com/gitai/cache/RedisCacheManager.java b/src/main/java/com/gitai/cache/RedisCacheManager.java
index 891f7c2..c1839ea 100644
--- a/src/main/java/com/gitai/cache/RedisCacheManager.java
+++ b/src/main/java/com/gitai/cache/RedisCacheManager.java
@@ -42,7 +42,7 @@ public class RedisCacheManager {
     public <T> Optional<T> getCachedGeneration(String cacheKey, Class<T> clazz) {
         try {
             Object raw = redisTemplate.opsForValue().get(cacheKey);
-            if (raw == null) {
+            if (raw == null || raw.toString().isBlank()) {
                 return Optional.empty();
             }
-            return Optional.of(objectMapper.convertValue(raw, clazz));
+            // Refresh TTL on cache hit to implement sliding expiration
+            redisTemplate.expire(cacheKey, Duration.ofMinutes(45));
+            return Optional.of(objectMapper.readValue(raw.toString(), clazz));
         } catch (Exception ex) {
-            log.error("Cache read failure: {}", ex.getMessage());
+            log.warn("Cache deserialization fallback for key {}: {}", cacheKey, ex.getMessage());
             return Optional.empty();
         }
     }
 }`,

  refactor: `diff --git a/src/main/java/com/gitai/controller/AiGeneratorController.java b/src/main/java/com/gitai/controller/AiGeneratorController.java
index 102e3b1..92bfe88 100644
--- a/src/main/java/com/gitai/controller/AiGeneratorController.java
+++ b/src/main/java/com/gitai/controller/AiGeneratorController.java
@@ -28,8 +28,15 @@ public class AiGeneratorController {
-    @PostMapping("/generate/commit")
-    public ResponseEntity<String> generateCommit(@RequestBody String diff) {
-        return ResponseEntity.ok(legacyAiService.prompt(diff));
-    }
+    @PostMapping("/generate/commit")
+    public ResponseEntity<CommitGenerateResponse> generateCommit(
+            @Valid @RequestBody CommitGenerateRequest request) {
+        CommitGenerateResponse response = aiPromptService.generateCommitMessage(request);
+        generationHistoryService.recordHistory(request, response);
+        return ResponseEntity.ok(response);
+    }
 }`
};

export const SAMPLE_COMMITS_FOR_RELEASE = `feat(auth): integrate GitHub OAuth2 login flow (#41)
feat(cache): add Redis sliding expiration for cached AI prompts (#43)
fix(security): sanitize Git diff input before sending to LLM prompt (#44)
fix(redis): handle deserialization errors gracefully on corrupted keys (#45)
perf(api): index generation_history by user_id and timestamp (#47)
refactor(controller): transition to typed DTO request validation (#48)
docs(readme): add Spring Boot architecture setup and Docker compose guide (#49)
chore(deps): upgrade Spring Boot from 3.2.1 to 3.3.0 (#50)`;

export const INITIAL_HISTORY: GenerationHistoryItem[] = [
  {
    id: 'gen-8831',
    type: 'commit',
    title: 'feat(auth): implement GitHub OAuth2 token exchange with Redis session storage',
    preview: 'feat(auth): implement GitHub OAuth2 token exchange with Redis session storage\n\n- Add clientId and clientSecret injection\n- Exchange authorization code with GitHub OAuth2 endpoint\n- Persist active session in Redis with 24h expiration',
    timestamp: '15 minutes ago',
    cached: true,
    repoName: 'spring-cloud-auth',
    fullOutput: 'feat(auth): implement GitHub OAuth2 token exchange with Redis session storage\n\n- Add clientId and clientSecret injection\n- Exchange authorization code with GitHub OAuth2 endpoint\n- Persist active session in Redis with 24h expiration',
  },
  {
    id: 'gen-8830',
    type: 'pr',
    title: 'PR: Redis sliding TTL expiration & fallback deserialization',
    preview: '## Summary\nResolves intermittent cache misses by transitioning Redis TTL to a sliding window model with defensive deserialization.',
    timestamp: '2 hours ago',
    cached: false,
    repoName: 'spring-cloud-auth',
    fullOutput: `## Summary
Resolves intermittent cache misses by transitioning Redis TTL to a sliding window model with defensive deserialization.

## Changes Made
- Implement 45-minute sliding TTL refresh on every cache hit
- Add null-or-blank validation check before converting cached payloads
- Fallback gracefully when cache payload schema mismatch occurs

## Rationale
Prevents stale evictions during high-throughput burst sessions and eliminates crash loops caused by broken cache entries.

## Testing & Verification
- [x] Verified unit tests for cache hits and misses
- [x] Simulated deserialization failures with corrupted strings
- [x] Checked Redis TTL expiration key tracking`,
  },
  {
    id: 'gen-8829',
    type: 'release',
    title: 'Release Notes: v1.3.0 — Enhanced OAuth & Robust Caching',
    preview: '## What\'s New in v1.3.0\nThis release introduces full GitHub OAuth2 authentication, Redis sliding caching, and typed API request validation.',
    timestamp: 'Yesterday',
    cached: true,
    repoName: 'spring-cloud-auth',
    fullOutput: `## Release v1.3.0 (2026-10-11)

### ✨ Features
- **GitHub OAuth2 Support**: Connect user accounts directly using OAuth2 code flow (#41)
- **Redis Sliding Cache**: Cache AI generation responses with automatic 45-min TTL sliding renewals (#43)

### 🐛 Bug Fixes
- **Diff Sanitization**: Sanitize huge multi-file patches before dispatching to LLM prompts (#44)
- **Safe Deserialization**: Prevent 500 server errors when encountering corrupted Redis cache values (#45)

### ⚡ Performance
- **PostgreSQL Indexing**: Optimized query latency by adding compound indexes on \`user_id\` and \`created_at\` (#47)

### 🛠️ Maintenance & Refactoring
- **Typed DTO Architecture**: Standardized controller endpoints using typed bean validation (#48)
- **Framework Upgrade**: Upgraded to Spring Boot 3.3.0 (#50)`,
  },
];

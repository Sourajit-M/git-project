import { Octokit } from '@octokit/rest';
import { ENV } from '../config/env.js';
import { redisCacheService } from './redisCacheService.js';

export const githubService = {
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: ENV.GITHUB_CLIENT_ID,
        client_secret: ENV.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = (await response.json()) as any;
    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
    }
    return data.access_token;
  },

  async getUserProfile(accessToken: string) {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    return {
      id: String(data.id),
      username: data.login,
      name: data.name || data.login,
      email: data.email || `${data.login}@users.noreply.github.com`,
      avatarUrl: data.avatar_url,
      htmlUrl: data.html_url,
      publicRepos: data.public_repos,
      privateRepos: data.total_private_repos || 0,
    };
  },

  async getRepositories(accessToken?: string) {
    if (!accessToken) {
      // Return sample repos if token is unauthenticated
      return this.mockRepositories();
    }

    const cacheKey = `github:repos:${accessToken.slice(-8)}`;
    const cached = await redisCacheService.get<any[]>(cacheKey);
    if (cached) return cached;

    try {
      const octokit = new Octokit({ auth: accessToken });
      const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 30,
      });

      const repos = data.map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description || 'No description provided',
        isPrivate: r.private,
        defaultBranch: r.default_branch,
        htmlUrl: r.html_url,
        language: r.language || 'Code',
        starsCount: r.stargazers_count,
        forksCount: r.forks_count,
        updatedAt: r.updated_at,
        branches: [r.default_branch],
      }));

      await redisCacheService.set(cacheKey, repos, 10 * 60); // 10m TTL
      return repos;
    } catch {
      return this.mockRepositories();
    }
  },

  async getBranches(repoName: string, accessToken?: string) {
    if (!accessToken) return ['main', 'develop', 'feature/new-api'];
    try {
      const octokit = new Octokit({ auth: accessToken });
      const [owner, repo] = repoName.includes('/') ? repoName.split('/') : ['user', repoName];
      const { data } = await octokit.rest.repos.listBranches({ owner, repo });
      return data.map((b) => b.name);
    } catch {
      return ['main', 'develop', 'feature/new-api'];
    }
  },

  async getDiff(repoName: string, base: string, head: string, accessToken?: string) {
    if (!accessToken) {
      return `diff --git a/src/service/GroqAiService.ts b/src/service/GroqAiService.ts
index 10a42b1..92bfe88 100644
--- a/src/service/GroqAiService.ts
+++ b/src/service/GroqAiService.ts
@@ -10,6 +10,12 @@ export class GroqAiService {
+    async promptGroq(diff: string) {
+        return await groqClient.chat.completions.create({
+            model: "llama-3.3-70b-versatile",
+            messages: [{ role: "user", content: diff }]
+        });
+    }
 }`;
    }

    try {
      const octokit = new Octokit({ auth: accessToken });
      const [owner, repo] = repoName.includes('/') ? repoName.split('/') : ['user', repoName];
      const { data } = await octokit.rest.repos.compareCommits({
        owner,
        repo,
        base,
        head,
        mediaType: { format: 'diff' },
      });
      return String(data);
    } catch {
      return '';
    }
  },

  mockRepositories() {
    return [
      {
        id: 101,
        name: 'git-ai-assistant',
        fullName: 'sourav-dev/git-ai-assistant',
        description: 'AI-assisted developer workflow for commits, PR descriptions, and release notes with Groq & Redis.',
        isPrivate: false,
        defaultBranch: 'main',
        htmlUrl: 'https://github.com/Sourajit-M/git-project',
        language: 'TypeScript',
        starsCount: 84,
        forksCount: 16,
        updatedAt: new Date().toISOString(),
        branches: ['main', 'feat/groq-service', 'fix/redis-cache'],
      },
      {
        id: 102,
        name: 'ecommerce-payment-gateway',
        fullName: 'sourav-dev/ecommerce-payment-gateway',
        description: 'Stripe and PayPal multi-tenant payment processor with webhook idempotency.',
        isPrivate: true,
        defaultBranch: 'main',
        htmlUrl: 'https://github.com/sourav-dev/ecommerce-payment-gateway',
        language: 'Node.js',
        starsCount: 67,
        forksCount: 12,
        updatedAt: new Date().toISOString(),
        branches: ['main', 'feat/stripe-v3-migration'],
      },
    ];
  },
};

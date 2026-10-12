import { request } from './api';
import { Repository } from '../types/repo';
import { UserProfile } from '../types/auth';
import { MOCK_REPOSITORIES, MOCK_USER, SAMPLE_DIFFS } from './mockData';

export const githubService = {
  // Check authenticated GitHub user profile
  async getCurrentUser(isDemo = false): Promise<UserProfile> {
    if (isDemo) {
      return MOCK_USER;
    }
    try {
      return await request<UserProfile>('/auth/me');
    } catch {
      return MOCK_USER;
    }
  },

  // Fetch list of user's GitHub repositories
  async getRepositories(isDemo = false): Promise<Repository[]> {
    if (isDemo) {
      return MOCK_REPOSITORIES;
    }
    try {
      return await request<Repository[]>('/github/repositories');
    } catch {
      return MOCK_REPOSITORIES;
    }
  },

  // Fetch branches for a specific repository
  async getBranches(repoName: string, isDemo = false): Promise<string[]> {
    if (isDemo) {
      const found = MOCK_REPOSITORIES.find((r) => r.name === repoName);
      return found?.branches || ['main', 'develop'];
    }
    try {
      return await request<string[]>(`/github/repositories/${encodeURIComponent(repoName)}/branches`);
    } catch {
      const found = MOCK_REPOSITORIES.find((r) => r.name === repoName);
      return found?.branches || ['main', 'develop'];
    }
  },

  // Fetch repository diff for branch comparison
  async getDiff(repoName: string, base: string, head: string, isDemo = false): Promise<string> {
    if (isDemo) {
      if (head.includes('bug') || head.includes('fix')) return SAMPLE_DIFFS.bugfix;
      if (head.includes('refactor')) return SAMPLE_DIFFS.refactor;
      return SAMPLE_DIFFS.feature;
    }
    try {
      const res = await request<{ diff: string }>(
        `/github/repositories/${encodeURIComponent(repoName)}/diff?base=${encodeURIComponent(base)}&head=${encodeURIComponent(head)}`
      );
      return res.diff;
    } catch {
      return SAMPLE_DIFFS.feature;
    }
  },
};

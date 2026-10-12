import { Request, Response } from 'express';
import { githubService } from '../services/githubService.js';

export const githubController = {
  async getRepositories(req: Request, res: Response) {
    try {
      const repos = await githubService.getRepositories();
      res.json(repos);
    } catch {
      res.status(500).json({ error: 'Failed to fetch repositories' });
    }
  },

  async getBranches(req: Request, res: Response) {
    try {
      const { repoName } = req.params;
      const branches = await githubService.getBranches(repoName);
      res.json(branches);
    } catch {
      res.status(500).json({ error: 'Failed to fetch branches' });
    }
  },

  async getDiff(req: Request, res: Response) {
    try {
      const { repoName } = req.params;
      const base = (req.query.base as string) || 'main';
      const head = (req.query.head as string) || 'develop';
      const diff = await githubService.getDiff(repoName, base, head);
      res.json({ diff });
    } catch {
      res.status(500).json({ error: 'Failed to fetch diff' });
    }
  },
};

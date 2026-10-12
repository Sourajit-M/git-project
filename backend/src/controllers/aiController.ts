import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';
import { historyService } from '../services/historyService.js';

export const aiController = {
  async generateCommit(req: Request, res: Response) {
    try {
      const { diff, repoName, format, scope, additionalContext } = req.body;
      if (!diff) {
        return res.status(400).json({ error: 'Diff is required' });
      }

      const result = await aiService.generateCommitMessage({
        diff,
        repoName,
        format,
        scope,
        additionalContext,
      });

      // Record in PostgreSQL history
      await historyService.recordHistory({
        type: 'commit',
        repoName,
        inputSnippet: diff,
        title: result.title,
        output: result.primaryMessage,
        modelUsed: result.modelUsed,
        cachedInRedis: result.cachedInRedis,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Commit generation failed' });
    }
  },

  async generatePullRequest(req: Request, res: Response) {
    try {
      const { baseBranch, compareBranch, diff, templateType, customInstructions } = req.body;
      if (!diff) {
        return res.status(400).json({ error: 'Diff is required' });
      }

      const result = await aiService.generatePullRequest({
        baseBranch: baseBranch || 'main',
        compareBranch: compareBranch || 'feature-branch',
        diff,
        templateType: templateType || 'full',
        customInstructions,
      });

      await historyService.recordHistory({
        type: 'pr',
        repoName: req.body.repoName,
        inputSnippet: diff,
        title: result.title,
        output: result.markdown,
        modelUsed: result.modelUsed,
        cachedInRedis: result.cachedInRedis,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'PR generation failed' });
    }
  },

  async generateReleaseNotes(req: Request, res: Response) {
    try {
      const { version, previousVersion, commitsList, audience } = req.body;
      if (!commitsList) {
        return res.status(400).json({ error: 'Commits list is required' });
      }

      const result = await aiService.generateReleaseNotes({
        version: version || 'v1.0.0',
        previousVersion,
        commitsList,
        audience,
      });

      await historyService.recordHistory({
        type: 'release',
        repoName: req.body.repoName,
        inputSnippet: commitsList,
        title: result.releaseTitle,
        output: result.rawMarkdown,
        modelUsed: result.modelUsed,
        cachedInRedis: result.cachedInRedis,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Release notes generation failed' });
    }
  },
};

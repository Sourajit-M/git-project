import { Router } from 'express';
import { githubController } from '../controllers/githubController.js';

export const githubRouter = Router();

githubRouter.get('/repositories', githubController.getRepositories);
githubRouter.get('/repositories/:repoName/branches', githubController.getBranches);
githubRouter.get('/repositories/:repoName/diff', githubController.getDiff);

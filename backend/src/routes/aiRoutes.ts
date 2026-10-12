import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

export const aiRouter = Router();

aiRouter.post('/generate/commit', aiController.generateCommit);
aiRouter.post('/generate/pull-request', aiController.generatePullRequest);
aiRouter.post('/generate/release-notes', aiController.generateReleaseNotes);

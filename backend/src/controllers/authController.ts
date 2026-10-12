import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { githubService } from '../services/githubService.js';
import { prisma } from '../config/prisma.js';

export const authController = {
  getLoginUrl(req: Request, res: Response) {
    const url = `https://github.com/login/oauth/authorize?client_id=${ENV.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      ENV.GITHUB_CALLBACK_URL
    )}&scope=repo,user:email`;
    res.json({ url });
  },

  async handleCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    try {
      const accessToken = await githubService.exchangeCodeForToken(code);
      const profile = await githubService.getUserProfile(accessToken);

      // Persist or update user in PostgreSQL
      const user = await prisma.user.upsert({
        where: { githubId: profile.id },
        update: {
          username: profile.username,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          accessToken,
        },
        create: {
          githubId: profile.id,
          username: profile.username,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          accessToken,
        },
      });

      const token = jwt.sign({ userId: user.id, username: user.username }, ENV.JWT_SECRET, {
        expiresIn: '7d',
      });

      // Redirect back to frontend with token
      res.redirect(`${ENV.FRONTEND_URL}?token=${token}`);
    } catch (err: any) {
      res.redirect(`${ENV.FRONTEND_URL}?error=${encodeURIComponent(err.message)}`);
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      let user = await prisma.user.findFirst();
      if (!user) {
        return res.json({
          id: 'gh-guest',
          username: 'sourav-dev',
          name: 'Sourav Roy',
          email: 'sourav.dev@example.com',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          htmlUrl: 'https://github.com/Sourajit-M',
          publicRepos: 18,
          privateRepos: 6,
        });
      }
      res.json(user);
    } catch {
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  },

  logout(req: Request, res: Response) {
    res.json({ success: true, message: 'Signed out successfully' });
  },
};

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes.js';
import { githubRouter } from './routes/githubRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import { historyRouter } from './routes/historyRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';

export const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.use('/api/v1/health', healthRouter);

// API Endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/github', githubRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/history', historyRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'GitAI Backend REST API',
    version: '1.0.0',
    aiProvider: 'Groq Cloud (llama-3.3-70b-versatile)',
    status: 'Running',
    docs: '/api/v1/health',
  });
});

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💥 [Server Error]:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

import { app } from './app.js';
import { ENV } from './config/env.js';

const server = app.listen(ENV.PORT, () => {
  console.log('========================================================');
  console.log(`🚀 GitAI Backend Server listening on port ${ENV.PORT}`);
  console.log(`🌐 Base URL: http://localhost:${ENV.PORT}`);
  console.log(`⚡ AI Engine: Groq (${ENV.GROQ_MODEL})`);
  console.log(`🐘 Database: PostgreSQL (Docker)`);
  console.log(`🏎️ Cache: Redis (Docker)`);
  console.log('========================================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

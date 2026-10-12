import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gitai_db?schema=public',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:8080/api/v1/auth/github/callback',
  JWT_SECRET: process.env.JWT_SECRET || 'gitai-super-secret-jwt-key-2026-secure',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

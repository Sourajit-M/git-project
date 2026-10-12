import Groq from 'groq-sdk';
import { ENV } from './env.js';

export const groqClient = ENV.GROQ_API_KEY
  ? new Groq({ apiKey: ENV.GROQ_API_KEY })
  : null;

if (!ENV.GROQ_API_KEY) {
  console.log('ℹ️ [Groq] GROQ_API_KEY is not configured yet. Fallback generation logic is active.');
} else {
  console.log(`✅ [Groq] Groq SDK initialized with model: ${ENV.GROQ_MODEL}`);
}

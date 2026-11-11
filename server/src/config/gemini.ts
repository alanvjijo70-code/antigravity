import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

let geminiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (!geminiClient) {
    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'placeholder-gemini-key') {
      console.warn('⚠️ Warning: GEMINI_API_KEY is not configured with a valid key. AI calls will require a valid API key.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }
  return geminiClient;
};

export const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash';

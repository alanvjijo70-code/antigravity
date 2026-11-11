import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required').default('https://placeholder.supabase.co'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required').default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),

  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required').default('placeholder-gemini-key'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),

  WEATHER_API_KEY: z.string().optional().default(''),
  WEATHER_API_BASE_URL: z.string().default('https://api.openweathermap.org/data/2.5'),

  MAX_IMAGE_SIZE_MB: z.coerce.number().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
}

export const env = parsed.success ? parsed.data : envSchema.parse({});

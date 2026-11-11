import { env } from './env.js';

export const weatherConfig = {
  apiKey: env.WEATHER_API_KEY,
  baseUrl: env.WEATHER_API_BASE_URL,
  isConfigured: Boolean(env.WEATHER_API_KEY && env.WEATHER_API_KEY.length > 5),
};

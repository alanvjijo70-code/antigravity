import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const standardLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    data: null,
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  },
});

export const aiEndpointLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 requests per 5 minutes per user/IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI advisory rate limit reached. Please wait a few moments before requesting more advice.',
    data: null,
    error: { code: 'AI_RATE_LIMIT_EXCEEDED' },
  },
});

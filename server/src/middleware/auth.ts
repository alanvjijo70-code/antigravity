import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      token?: string;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid',
        data: null,
        error: { code: 'UNAUTHORIZED' },
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Bearer token format invalid',
        data: null,
        error: { code: 'UNAUTHORIZED' },
      });
      return;
    }

    // Verify token with Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      // In development / demo mode, if mock token is passed for testing
      if (process.env.NODE_ENV === 'development' && token.startsWith('demo-user-')) {
        req.user = {
          id: token.replace('demo-user-', ''),
          email: 'farmer@agrisense.ai',
          user_metadata: { full_name: 'Dev Farmer' },
        };
        req.token = token;
        next();
        return;
      }

      res.status(401).json({
        success: false,
        message: 'Invalid or expired session token',
        data: null,
        error: { code: 'INVALID_TOKEN', details: error?.message },
      });
      return;
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
    };
    req.token = token;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate user',
      data: null,
      error: { code: 'AUTH_INTERNAL_ERROR', details: err.message },
    });
  }
};

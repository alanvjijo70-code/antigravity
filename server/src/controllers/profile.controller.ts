import { Request, Response, NextFunction } from 'express';
import { createUserClient } from '../config/supabase.js';
import { UpdateProfileSchema } from '../validators/index.js';

export class ProfileController {
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is no rows
        throw error;
      }

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: data || {
          id: userId,
          full_name: req.user?.user_metadata?.full_name || 'Farmer',
          preferred_language: 'en',
          land_unit: 'acre',
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validated = UpdateProfileSchema.parse(req.body);
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('profiles')
        .upsert({
          id: userId,
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { createUserClient } from '../config/supabase.js';
import { CreateFarmSchema, UpdateFarmSchema } from '../validators/index.js';

export class FarmController {
  public static async listFarms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('farms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Farms retrieved successfully',
        data: data || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validated = CreateFarmSchema.parse(req.body);
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('farms')
        .insert({
          user_id: userId,
          ...validated,
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Farm parcel created successfully',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getFarmById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const farmId = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('farms')
        .select('*')
        .eq('id', farmId)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        res.status(404).json({
          success: false,
          message: 'Farm not found or access denied',
          data: null,
          error: { code: 'FARM_NOT_FOUND' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Farm retrieved successfully',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const farmId = req.params.id;
      const validated = UpdateFarmSchema.parse(req.body);
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('farms')
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Farm updated successfully',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteFarm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const farmId = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { error } = await supabaseUser
        .from('farms')
        .delete()
        .eq('id', farmId)
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Farm deleted successfully',
        data: { id: farmId },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

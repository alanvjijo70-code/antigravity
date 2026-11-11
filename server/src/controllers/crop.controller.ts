import { Request, Response, NextFunction } from 'express';
import { CropRecommendationRequestSchema } from '../validators/index.js';
import { CropAdvisoryService } from '../services/crop-advisory.service.js';
import { createUserClient } from '../config/supabase.js';

export class CropController {
  public static async recommendCrops(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;
      const validated = CropRecommendationRequestSchema.parse(req.body);

      const result = await CropAdvisoryService.getRecommendations({
        userId,
        userToken,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Crop recommendations generated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async listRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('crop_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Recommendation history retrieved',
        data: data || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getRecommendationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('crop_recommendations')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        res.status(404).json({
          success: false,
          message: 'Crop recommendation report not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Crop recommendation report retrieved',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteRecommendation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { error } = await supabaseUser
        .from('crop_recommendations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Recommendation deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

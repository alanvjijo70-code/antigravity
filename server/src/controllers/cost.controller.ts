import { Request, Response, NextFunction } from 'express';
import { CostEstimatorRequestSchema } from '../validators/index.js';
import { CostEstimatorService } from '../services/cost-estimator.service.js';
import { createUserClient } from '../config/supabase.js';

export class CostController {
  public static async calculateCost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;
      const validated = CostEstimatorRequestSchema.parse(req.body);

      const result = await CostEstimatorService.calculate({
        userId,
        userToken,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Cultivation cost calculated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('farming_cost_estimates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Cost estimation history retrieved',
        data: data || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('farming_cost_estimates')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        res.status(404).json({
          success: false,
          message: 'Cost estimate not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Cost estimate retrieved',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteEstimate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { error } = await supabaseUser
        .from('farming_cost_estimates')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Cost estimate deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

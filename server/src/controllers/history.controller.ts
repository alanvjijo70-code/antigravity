import { Request, Response, NextFunction } from 'express';
import { createUserClient } from '../config/supabase.js';

export class HistoryController {
  public static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const type = req.query.type as string;
      const limit = parseInt(req.query.limit as string) || 50;
      const supabaseUser = createUserClient(req.token!);

      let query = supabaseUser
        .from('advisory_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type && type !== 'all') {
        query = query.eq('advisory_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Advisory history retrieved successfully',
        data: data || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { error } = await supabaseUser
        .from('advisory_reports')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Advisory record deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

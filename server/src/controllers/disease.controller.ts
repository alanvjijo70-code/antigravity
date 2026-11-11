import { Request, Response, NextFunction } from 'express';
import { DiseaseDetectionRequestSchema } from '../validators/index.js';
import { DiseaseDetectionService } from '../services/disease-detection.service.js';
import { createUserClient } from '../config/supabase.js';

export class DiseaseController {
  public static async analyzeImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Please upload an image file of the affected plant or foliage.',
          data: null,
          error: { code: 'IMAGE_REQUIRED' },
        });
        return;
      }

      const validated = DiseaseDetectionRequestSchema.parse(req.body);

      const result = await DiseaseDetectionService.analyzePlant({
        userId,
        userToken,
        imageFile: req.file,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Plant disease analysis completed successfully',
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
        .from('disease_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Disease diagnosis history retrieved',
        data: data || [],
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getDetailsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { data, error } = await supabaseUser
        .from('disease_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        res.status(404).json({
          success: false,
          message: 'Disease analysis report not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Disease analysis report retrieved',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const supabaseUser = createUserClient(req.token!);

      const { error } = await supabaseUser
        .from('disease_analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.status(200).json({
        success: true,
        message: 'Disease analysis record deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

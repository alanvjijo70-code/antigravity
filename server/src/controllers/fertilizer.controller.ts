import { Request, Response, NextFunction } from 'express';
import { FertilizerAdvisoryRequestSchema } from '../validators/index.js';
import { FertilizerAdvisoryService } from '../services/fertilizer-advisory.service.js';

export class FertilizerController {
  public static async recommendFertilizer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;
      const validated = FertilizerAdvisoryRequestSchema.parse(req.body);

      const result = await FertilizerAdvisoryService.getAdvisory({
        userId,
        userToken,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Fertilizer advisory generated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { IrrigationAdvisoryRequestSchema } from '../validators/index.js';
import { IrrigationAdvisoryService } from '../services/irrigation-advisory.service.js';

export class IrrigationController {
  public static async recommendIrrigation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;
      const validated = IrrigationAdvisoryRequestSchema.parse(req.body);

      const result = await IrrigationAdvisoryService.getAdvisory({
        userId,
        userToken,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Irrigation advisory generated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

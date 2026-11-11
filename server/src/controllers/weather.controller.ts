import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service.js';
import { z } from 'zod';

const WeatherQuerySchema = z.object({
  lat: z.coerce.number().optional().nullable(),
  lon: z.coerce.number().optional().nullable(),
  location: z.string().optional().default('Local Farm'),
});

const WeatherAdvisoryBodySchema = z.object({
  location_name: z.string(),
  temperature: z.coerce.number(),
  humidity: z.coerce.number(),
  rainfall: z.coerce.number().default(0),
  wind_speed: z.coerce.number().default(0),
  weather_description: z.string(),
  language: z.enum(['en', 'ml']).default('en'),
});

export class WeatherController {
  public static async getCurrentWeather(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lat, lon, location } = WeatherQuerySchema.parse(req.query);
      const data = await WeatherService.getCurrentWeather(lat, lon, location);

      res.status(200).json({
        success: true,
        message: 'Current weather retrieved',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getForecast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lat, lon, location } = WeatherQuerySchema.parse(req.query);
      const data = await WeatherService.getForecast(lat, lon, location);

      res.status(200).json({
        success: true,
        message: 'Weather forecast retrieved',
        data,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async generateAdvisory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userToken = req.token!;
      const validated = WeatherAdvisoryBodySchema.parse(req.body);

      const result = await WeatherService.generateAdvisory({
        userId,
        userToken,
        ...validated,
      });

      res.status(200).json({
        success: true,
        message: 'Weather agricultural advisory generated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}

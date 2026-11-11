import { z } from 'zod';

export const FarmPlotSchema = z.object({
  plot_name: z.string().min(2, "Plot name must be at least 2 characters").max(50),
  size_in_acres: z.number().positive("Acreage must be greater than 0").max(10000),
  soil_type: z.enum([
    'Alluvial', 'Black Cotton', 'Red & Yellow', 'Laterite', 
    'Sandy Loam', 'Clay Loam', 'Peaty/Marshy', 'Saline/Alkaline'
  ]),
  irrigation_source: z.enum([
    'Drip Irrigation', 'Overhead Sprinkler', 'Flood/Furrow', 
    'Rainfed', 'Canal Basin', 'Sub-surface Drip'
  ]),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  region_name: z.string().min(2, "Region or district is required")
});

export const CropRecommendationRequestSchema = z.object({
  plot_id: z.string().uuid().optional().nullable(),
  nitrogen_level: z.coerce.number().min(0, "Nitrogen cannot be negative").max(1000, "Maximum 1000 kg/ha"),
  phosphorus_level: z.coerce.number().min(0, "Phosphorus cannot be negative").max(1000, "Maximum 1000 kg/ha"),
  potassium_level: z.coerce.number().min(0, "Potassium cannot be negative").max(1000, "Maximum 1000 kg/ha"),
  soil_ph: z.coerce.number().min(3.0, "Minimum pH is 3.0").max(11.0, "Maximum pH is 11.0"),
  electrical_conductivity: z.coerce.number().min(0).max(20).optional().nullable(),
  water_availability: z.enum(['Abundant', 'Moderate', 'Deficit', 'Strictly Rainfed']),
  budget_tier: z.enum(['Low-Input/Subsistence', 'Moderate', 'Commercial/High-Yield']),
  target_season: z.enum(['Kharif/Monsoon', 'Rabi/Winter', 'Zaid/Summer', 'Year-Round Perennial']),
  language: z.string().default('en')
});

export const DiseaseDiagnosisRequestSchema = z.object({
  crop_name: z.string().min(2, "Crop name is required"),
  plant_part_affected: z.enum(['Leaves', 'Stem/Shoot', 'Fruit/Earhead', 'Root', 'Whole Plant']),
  symptom_duration_days: z.coerce.number().int().min(1, "Minimum 1 day").max(365),
  additional_observations: z.string().max(1000).optional().default(''),
  plot_id: z.string().uuid().optional().nullable(),
  language: z.string().default('en')
});

export const GenerateScheduleRequestSchema = z.object({
  plot_id: z.string().uuid("A valid plot selection is required"),
  crop_name: z.string().min(2, "Crop name is required"),
  variety: z.string().optional().default('Standard Local Variety'),
  sowing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  language: z.string().default('en')
});

export const MarketEstimateRequestSchema = z.object({
  crop_name: z.string().min(2, "Crop name is required"),
  acreage: z.coerce.number().positive("Acreage must be greater than 0"),
  region_name: z.string().min(2, "Region is required"),
  target_season: z.enum(['Kharif/Monsoon', 'Rabi/Winter', 'Zaid/Summer', 'Year-Round Perennial'])
});

import { z } from 'zod';

// ==========================================
// 1. Profile Validators
// ==========================================
export const UpdateProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().optional().nullable(),
  preferred_language: z.enum(['en', 'ml']).default('en'),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  village: z.string().optional().nullable(),
  farm_name: z.string().optional().nullable(),
  land_area: z.coerce.number().positive('Land area must be greater than 0').optional().nullable(),
  land_unit: z.enum(['acre', 'hectare', 'cent', 'guntha', 'bigha']).default('acre'),
  farming_type: z.string().optional().nullable(),
});

// ==========================================
// 2. Farm Validators
// ==========================================
export const CreateFarmSchema = z.object({
  farm_name: z.string().min(2, 'Farm name is required').max(100),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  land_area: z.coerce.number().positive('Land area must be greater than 0'),
  land_unit: z.enum(['acre', 'hectare', 'cent', 'guntha', 'bigha']).default('acre'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().min(0).optional().nullable(),
  phosphorus: z.coerce.number().min(0).optional().nullable(),
  potassium: z.coerce.number().min(0).optional().nullable(),
  water_source: z.string().min(2, 'Water source is required'),
  farming_method: z.string().optional().nullable().default('Conventional'),
});

export const UpdateFarmSchema = CreateFarmSchema.partial();

// ==========================================
// 3. Crop Recommendation Request Validator
// ==========================================
export const CropRecommendationRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().optional().nullable(),
  land_area: z.coerce.number().positive('Land area must be greater than 0'),
  land_unit: z.enum(['acre', 'hectare', 'cent', 'guntha', 'bigha']).default('acre'),
  soil_type: z.string().min(2, 'Soil type is required'),
  soil_ph: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().min(0).optional().nullable(),
  phosphorus: z.coerce.number().min(0).optional().nullable(),
  potassium: z.coerce.number().min(0).optional().nullable(),
  water_source: z.string().min(2, 'Water source is required'),
  season: z.string().min(2, 'Current season is required'),
  crop_category: z.string().optional().nullable(),
  farming_method: z.string().default('Integrated'),
  language: z.enum(['en', 'ml']).default('en'),
});

// ==========================================
// 4. Disease Detection Request Validator
// ==========================================
export const DiseaseDetectionRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  crop_name: z.string().min(2, 'Crop name is required'),
  plant_part_affected: z.enum(['Leaves', 'Stem/Shoot', 'Fruit/Earhead', 'Root', 'Whole Plant']).default('Leaves'),
  symptoms: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  date_observed: z.string().optional().nullable(),
  language: z.enum(['en', 'ml']).default('en'),
});

// ==========================================
// 5. Fertilizer Advisory Request Validator
// ==========================================
export const FertilizerAdvisoryRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: z.string().min(2, 'Growth stage is required (e.g. Vegetative, Flowering, Fruiting)'),
  land_area: z.coerce.number().positive().default(1),
  land_unit: z.enum(['acre', 'hectare', 'cent', 'guntha', 'bigha']).default('acre'),
  soil_type: z.string().optional().nullable(),
  soil_ph: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().min(0).optional().nullable(),
  phosphorus: z.coerce.number().min(0).optional().nullable(),
  potassium: z.coerce.number().min(0).optional().nullable(),
  previous_application: z.string().optional().nullable(),
  farming_method: z.string().default('Integrated'),
  language: z.enum(['en', 'ml']).default('en'),
});

// ==========================================
// 6. Irrigation Advisory Request Validator
// ==========================================
export const IrrigationAdvisoryRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  crop_name: z.string().min(2, 'Crop name is required'),
  growth_stage: z.string().min(2, 'Growth stage is required'),
  soil_type: z.string().min(2, 'Soil type is required'),
  land_area: z.coerce.number().positive().default(1),
  land_unit: z.enum(['acre', 'hectare', 'cent', 'guntha', 'bigha']).default('acre'),
  water_source: z.string().min(2, 'Water source is required'),
  irrigation_method: z.string().default('Drip Irrigation'),
  recent_rainfall: z.string().optional().nullable(),
  weather_notes: z.string().optional().nullable(),
  language: z.enum(['en', 'ml']).default('en'),
});

// ==========================================
// 7. Cost Estimator Request Validator
// ==========================================
export const CostEstimatorRequestSchema = z.object({
  farm_id: z.string().uuid().optional().nullable(),
  crop_name: z.string().min(2, 'Crop name is required'),
  land_area: z.coerce.number().positive('Land area must be greater than 0'),
  land_unit: z.enum(['acre', 'hectare', 'cent', 'guntha', 'bigha']).default('acre'),
  seeds_cost: z.coerce.number().min(0).default(0),
  labour_cost: z.coerce.number().min(0).default(0),
  fertilizer_cost: z.coerce.number().min(0).default(0),
  pesticide_cost: z.coerce.number().min(0).default(0),
  irrigation_cost: z.coerce.number().min(0).default(0),
  machinery_cost: z.coerce.number().min(0).default(0),
  transportation_cost: z.coerce.number().min(0).default(0),
  other_expenses: z.coerce.number().min(0).default(0),
  expected_yield: z.coerce.number().min(0).optional().nullable(),
  expected_price_per_unit: z.coerce.number().min(0).optional().nullable(),
  yield_unit: z.string().default('quintals'),
  currency: z.string().default('INR'),
  language: z.enum(['en', 'ml']).default('en'),
});

// ==========================================
// 8. Chat Message Request Validator
// ==========================================
export const ChatMessageRequestSchema = z.object({
  conversation_id: z.string().uuid().optional().nullable(),
  content: z.string().min(1, 'Message content cannot be empty').max(2000),
  language: z.enum(['en', 'ml']).default('en'),
  farm_context: z.record(z.any()).optional().nullable(),
});

// ====================================================================
// 9. AI OUTPUT SCHEMAS (ZOD VALIDATION FOR GEMINI GENERATED RESPONSES)
// ====================================================================

export const CropRecommendationOutputSchema = z.object({
  summary: z.string(),
  data_sufficiency: z.enum(['sufficient', 'partial', 'insufficient']),
  missing_information: z.array(z.string()),
  recommendations: z.array(
    z.object({
      crop_name: z.string(),
      scientific_name: z.string().nullable().optional(),
      suitability_score: z.number().min(0).max(100),
      reason: z.string(),
      soil_requirements: z.string(),
      climate_requirements: z.string(),
      water_requirements: z.string(),
      sowing_period: z.string(),
      growth_duration: z.string(),
      precautions: z.array(z.string()),
    })
  ),
  overall_advice: z.string(),
  limitations: z.array(z.string()),
});

export const DiseaseDetectionOutputSchema = z.object({
  image_quality: z.enum(['good', 'acceptable', 'poor']),
  is_plant_image: z.boolean(),
  observed_symptoms: z.array(z.string()),
  possible_conditions: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      confidence: z.number().min(0).max(100),
      reason: z.string(),
    })
  ),
  immediate_actions: z.array(z.string()),
  preventive_measures: z.array(z.string()),
  expert_consultation_required: z.boolean(),
  additional_information_needed: z.array(z.string()),
  disclaimer: z.string(),
});

export const FertilizerAdvisoryOutputSchema = z.object({
  summary: z.string(),
  nutrient_status: z.string(),
  recommendations: z.array(
    z.object({
      nutrient: z.string(),
      fertilizer_option: z.string(),
      purpose: z.string(),
      application_timing: z.string(),
      application_method: z.string(),
      quantity: z.string().nullable().optional(),
    })
  ),
  organic_alternatives: z.array(z.string()),
  safety_precautions: z.array(z.string()),
  missing_information: z.array(z.string()),
});

export const IrrigationAdvisoryOutputSchema = z.object({
  summary: z.string(),
  irrigation_method: z.string(),
  frequency: z.string(),
  water_requirement: z.string().nullable().optional(),
  best_irrigation_time: z.string(),
  weather_considerations: z.array(z.string()),
  water_saving_methods: z.array(z.string()),
  warning_signs: z.array(z.string()),
  limitations: z.array(z.string()),
});

export const WeatherAdvisoryOutputSchema = z.object({
  weather_summary: z.string(),
  agricultural_risks: z.array(
    z.object({
      risk: z.string(),
      severity: z.string(),
      explanation: z.string(),
      recommended_action: z.string(),
    })
  ),
  farming_precautions: z.array(z.string()),
  irrigation_advice: z.string(),
  limitations: z.array(z.string()),
});

export const ChatAssistantOutputSchema = z.object({
  answer: z.string(),
  important_points: z.array(z.string()).optional().default([]),
  recommended_actions: z.array(z.string()).optional().default([]),
  warnings: z.array(z.string()).optional().default([]),
  follow_up_question: z.string().nullable().optional(),
  limitations: z.array(z.string()).optional().default([]),
});

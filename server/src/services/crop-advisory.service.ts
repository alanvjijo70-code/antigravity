import { GeminiService } from './gemini.service.js';
import { buildCropRecommendationPrompt, CROP_RECOMMENDATION_JSON_SCHEMA } from '../prompts/crop.prompt.js';
import { CropRecommendationOutputSchema } from '../validators/index.js';
import { createUserClient } from '../config/supabase.js';

export interface CropRecommendationParams {
  userId: string;
  userToken: string;
  farm_id?: string | null;
  state: string;
  district: string;
  village?: string | null;
  land_area: number;
  land_unit: string;
  soil_type: string;
  soil_ph?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  water_source: string;
  season: string;
  crop_category?: string | null;
  farming_method: string;
  language: string;
}

export class CropAdvisoryService {
  public static async getRecommendations(params: CropRecommendationParams) {
    const prompt = buildCropRecommendationPrompt(params);

    // Call Gemini with schema
    const rawResult = await GeminiService.generateStructured<any>({
      prompt,
      jsonSchema: CROP_RECOMMENDATION_JSON_SCHEMA,
    });

    // Validate structured response with Zod
    const validated = CropRecommendationOutputSchema.parse(rawResult);

    // Persist to Supabase Database
    try {
      const supabaseUser = createUserClient(params.userToken);

      // Insert into crop_recommendations
      const { data: cropRec, error: recError } = await supabaseUser
        .from('crop_recommendations')
        .insert({
          user_id: params.userId,
          farm_id: params.farm_id || null,
          input_data: {
            state: params.state,
            district: params.district,
            village: params.village,
            land_area: params.land_area,
            land_unit: params.land_unit,
            soil_type: params.soil_type,
            soil_ph: params.soil_ph,
            nitrogen: params.nitrogen,
            phosphorus: params.phosphorus,
            potassium: params.potassium,
            water_source: params.water_source,
            season: params.season,
            crop_category: params.crop_category,
            farming_method: params.farming_method,
          },
          recommendations: validated,
          language: params.language,
          ai_model: 'gemini-2.5-flash',
        })
        .select()
        .single();

      if (recError) {
        console.warn('Note: Could not persist crop recommendation to Supabase:', recError.message);
      }

      // Also log unified advisory report
      await supabaseUser.from('advisory_reports').insert({
        user_id: params.userId,
        farm_id: params.farm_id || null,
        advisory_type: 'crop',
        title: `Crop Advisory: ${params.district}, ${params.state} (${params.season})`,
        input_data: {
          district: params.district,
          state: params.state,
          season: params.season,
          soil_type: params.soil_type,
        },
        result_data: validated,
        status: 'completed',
      });

      return {
        id: cropRec?.id || 'temp-' + Date.now(),
        ...validated,
        created_at: cropRec?.created_at || new Date().toISOString(),
      };
    } catch (dbErr: any) {
      console.warn('Database save warning (proceeding with validated AI result):', dbErr.message);
      return {
        id: 'temp-' + Date.now(),
        ...validated,
        created_at: new Date().toISOString(),
      };
    }
  }
}

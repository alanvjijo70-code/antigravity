import { GeminiService } from './gemini.service.js';
import { buildFertilizerPrompt, FERTILIZER_ADVISORY_JSON_SCHEMA } from '../prompts/fertilizer.prompt.js';
import { FertilizerAdvisoryOutputSchema } from '../validators/index.js';
import { createUserClient } from '../config/supabase.js';

export interface FertilizerParams {
  userId: string;
  userToken: string;
  farm_id?: string | null;
  crop_name: string;
  growth_stage: string;
  land_area: number;
  land_unit: string;
  soil_type?: string | null;
  soil_ph?: number | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  previous_application?: string | null;
  farming_method: string;
  language: string;
}

export class FertilizerAdvisoryService {
  public static async getAdvisory(params: FertilizerParams) {
    const prompt = buildFertilizerPrompt(params);

    const rawResult = await GeminiService.generateStructured<any>({
      prompt,
      jsonSchema: FERTILIZER_ADVISORY_JSON_SCHEMA,
    });

    const validated = FertilizerAdvisoryOutputSchema.parse(rawResult);

    try {
      const supabaseUser = createUserClient(params.userToken);

      const { data: report, error } = await supabaseUser
        .from('advisory_reports')
        .insert({
          user_id: params.userId,
          farm_id: params.farm_id || null,
          advisory_type: 'fertilizer',
          title: `Fertilizer Plan: ${params.crop_name} (${params.growth_stage})`,
          input_data: {
            crop_name: params.crop_name,
            growth_stage: params.growth_stage,
            land_area: params.land_area,
            land_unit: params.land_unit,
            soil_type: params.soil_type,
            farming_method: params.farming_method,
          },
          result_data: validated,
          status: 'completed',
        })
        .select()
        .single();

      return {
        id: report?.id || 'temp-' + Date.now(),
        ...validated,
        created_at: report?.created_at || new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('Database log warning:', err.message);
      return {
        id: 'temp-' + Date.now(),
        ...validated,
        created_at: new Date().toISOString(),
      };
    }
  }
}

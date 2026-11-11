import { GeminiService } from './gemini.service.js';
import { buildIrrigationPrompt, IRRIGATION_ADVISORY_JSON_SCHEMA } from '../prompts/irrigation.prompt.js';
import { IrrigationAdvisoryOutputSchema } from '../validators/index.js';
import { createUserClient } from '../config/supabase.js';

export interface IrrigationParams {
  userId: string;
  userToken: string;
  farm_id?: string | null;
  crop_name: string;
  growth_stage: string;
  soil_type: string;
  land_area: number;
  land_unit: string;
  water_source: string;
  irrigation_method: string;
  recent_rainfall?: string | null;
  weather_notes?: string | null;
  language: string;
}

export class IrrigationAdvisoryService {
  public static async getAdvisory(params: IrrigationParams) {
    const prompt = buildIrrigationPrompt(params);

    const rawResult = await GeminiService.generateStructured<any>({
      prompt,
      jsonSchema: IRRIGATION_ADVISORY_JSON_SCHEMA,
    });

    const validated = IrrigationAdvisoryOutputSchema.parse(rawResult);

    try {
      const supabaseUser = createUserClient(params.userToken);

      const { data: report } = await supabaseUser
        .from('advisory_reports')
        .insert({
          user_id: params.userId,
          farm_id: params.farm_id || null,
          advisory_type: 'irrigation',
          title: `Irrigation Guide: ${params.crop_name} (${params.irrigation_method})`,
          input_data: {
            crop_name: params.crop_name,
            growth_stage: params.growth_stage,
            soil_type: params.soil_type,
            water_source: params.water_source,
            irrigation_method: params.irrigation_method,
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

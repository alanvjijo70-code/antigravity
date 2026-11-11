import { GeminiService } from './gemini.service.js';
import { buildDiseaseDetectionPrompt, DISEASE_DETECTION_JSON_SCHEMA } from '../prompts/disease.prompt.js';
import { DiseaseDetectionOutputSchema } from '../validators/index.js';
import { createUserClient, supabaseAdmin } from '../config/supabase.js';
import crypto from 'crypto';

export interface DiseaseDetectionParams {
  userId: string;
  userToken: string;
  farm_id?: string | null;
  crop_name: string;
  plant_part_affected: string;
  symptoms?: string | null;
  location?: string | null;
  date_observed?: string | null;
  language: string;
  imageFile?: Express.Multer.File;
}

export class DiseaseDetectionService {
  public static async analyzePlant(params: DiseaseDetectionParams) {
    if (!params.imageFile) {
      throw new Error('A plant photograph is required for plant disease and pest diagnosis.');
    }

    const prompt = buildDiseaseDetectionPrompt(params);

    // Call Gemini with Multimodal Image Buffer
    const rawResult = await GeminiService.generateStructured<any>({
      prompt,
      jsonSchema: DISEASE_DETECTION_JSON_SCHEMA,
      imageBuffer: params.imageFile.buffer,
      imageMimeType: params.imageFile.mimetype,
    });

    // Validate structured response with Zod
    const validated = DiseaseDetectionOutputSchema.parse(rawResult);

    // Upload image to Supabase Storage or retain image path
    let imageUrl = `data:${params.imageFile.mimetype};base64,${params.imageFile.buffer.toString('base64')}`;
    const fileExt = params.imageFile.mimetype.split('/')[1] || 'jpg';
    const fileName = `${params.userId}/${crypto.randomUUID()}.${fileExt}`;

    try {
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('crop-diagnosis-images')
        .upload(fileName, params.imageFile.buffer, {
          contentType: params.imageFile.mimetype,
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('crop-diagnosis-images')
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        }
      }
    } catch (storageErr: any) {
      console.warn('Storage upload note (using base64 data URL):', storageErr.message);
    }

    // Persist to Supabase Database
    try {
      const supabaseUser = createUserClient(params.userToken);

      const { data: diagnosisRecord, error: dbErr } = await supabaseUser
        .from('disease_analyses')
        .insert({
          user_id: params.userId,
          farm_id: params.farm_id || null,
          crop_name: params.crop_name,
          image_path: imageUrl,
          symptoms: params.symptoms || null,
          analysis_result: validated,
          ai_model: 'gemini-2.5-flash',
        })
        .select()
        .single();

      if (dbErr) {
        console.warn('Could not persist disease diagnosis to DB:', dbErr.message);
      }

      // Also log unified advisory report
      const primaryCondition = validated.possible_conditions[0]?.name || 'Crop Health Assessment';
      await supabaseUser.from('advisory_reports').insert({
        user_id: params.userId,
        farm_id: params.farm_id || null,
        advisory_type: 'disease',
        title: `Plant Pathology: ${params.crop_name} (${primaryCondition})`,
        input_data: {
          crop_name: params.crop_name,
          plant_part: params.plant_part_affected,
          symptoms: params.symptoms,
        },
        result_data: { ...validated, image_url: imageUrl },
        status: 'completed',
      });

      return {
        id: diagnosisRecord?.id || 'temp-' + Date.now(),
        image_url: imageUrl,
        ...validated,
        created_at: diagnosisRecord?.created_at || new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('Database save warning (returning validated diagnosis):', err.message);
      return {
        id: 'temp-' + Date.now(),
        image_url: imageUrl,
        ...validated,
        created_at: new Date().toISOString(),
      };
    }
  }
}

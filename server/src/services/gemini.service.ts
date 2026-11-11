import { getGeminiClient, GEMINI_MODEL } from '../config/gemini.js';
import { SYSTEM_INSTRUCTION } from '../prompts/system.prompt.js';

export interface GenerateStructuredOptions {
  prompt: string;
  jsonSchema: Record<string, any>;
  imageBuffer?: Buffer;
  imageMimeType?: string;
  systemInstruction?: string;
  temperature?: number;
}

export class GeminiService {
  /**
   * Generates structured JSON output from Gemini with schema enforcement.
   */
  public static async generateStructured<T>(options: GenerateStructuredOptions): Promise<T> {
    const ai = getGeminiClient();
    const contents: any[] = [];

    // If an image buffer is provided (multimodal analysis)
    if (options.imageBuffer && options.imageMimeType) {
      contents.push({
        inlineData: {
          data: options.imageBuffer.toString('base64'),
          mimeType: options.imageMimeType,
        },
      });
    }

    // Add text prompt
    contents.push({ text: options.prompt });

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: options.systemInstruction || SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: options.jsonSchema,
          temperature: options.temperature ?? 0.3, // Low temperature for high agricultural precision
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini API returned an empty text response.');
      }

      // Parse JSON safely
      const parsed = JSON.parse(responseText.trim());
      return parsed as T;
    } catch (err: any) {
      console.error('[GeminiService Error]:', err.message || err);
      throw err;
    }
  }
}

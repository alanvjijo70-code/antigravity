export const CROP_RECOMMENDATION_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    data_sufficiency: { type: "string", enum: ["sufficient", "partial", "insufficient"] },
    missing_information: { type: "array", items: { type: "string" } },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          crop_name: { type: "string" },
          scientific_name: { type: "string" },
          suitability_score: { type: "number", description: "Suitability score from 0 to 100" },
          reason: { type: "string" },
          soil_requirements: { type: "string" },
          climate_requirements: { type: "string" },
          water_requirements: { type: "string" },
          sowing_period: { type: "string" },
          growth_duration: { type: "string" },
          precautions: { type: "array", items: { type: "string" } }
        },
        required: [
          "crop_name", "suitability_score", "reason", "soil_requirements",
          "climate_requirements", "water_requirements", "sowing_period",
          "growth_duration", "precautions"
        ]
      }
    },
    overall_advice: { type: "string" },
    limitations: { type: "array", items: { type: "string" } }
  },
  required: [
    "summary", "data_sufficiency", "missing_information",
    "recommendations", "overall_advice", "limitations"
  ]
};

export const buildCropRecommendationPrompt = (params: {
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
}): string => {
  return `Analyze the supplied agricultural information and recommend the top crops suitable for the farmer's land.

FARM CONTEXT:
- Location: ${params.district}, ${params.state}${params.village ? ` (Village/Locality: ${params.village})` : ''}
- Total Land Area: ${params.land_area} ${params.land_unit}
- Soil Type: ${params.soil_type}
- Soil pH: ${params.soil_ph !== null && params.soil_ph !== undefined ? params.soil_ph : 'Unknown / Not tested'}
- Available Nitrogen (N): ${params.nitrogen !== null && params.nitrogen !== undefined ? `${params.nitrogen} kg/ha` : 'Not tested'}
- Available Phosphorus (P): ${params.phosphorus !== null && params.phosphorus !== undefined ? `${params.phosphorus} kg/ha` : 'Not tested'}
- Available Potassium (K): ${params.potassium !== null && params.potassium !== undefined ? `${params.potassium} kg/ha` : 'Not tested'}
- Primary Water Source: ${params.water_source}
- Current Farming Season: ${params.season}
- Preferred Crop Category: ${params.crop_category || 'Any viable category'}
- Farming Practice: ${params.farming_method}
- Desired Output Language: ${params.language === 'ml' ? 'Malayalam' : 'English'}

INSTRUCTIONS:
1. Rank suitable crops based on compatibility with the soil type, current season, water availability, and regional agricultural climate (e.g., Kerala / Indian agro-climatic zones).
2. For each recommended crop, provide the suitability score (0-100), reasoning, soil and climate requirements, optimal sowing window, duration to harvest, and specific cultivation precautions.
3. If soil nutrient data is unspecified, classify data_sufficiency as "partial" and note the missing tests in missing_information.
4. Provide practical overall advice and state any limitations transparently.`;
};

export const FERTILIZER_ADVISORY_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    nutrient_status: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nutrient: { type: "string", description: "e.g., Nitrogen (N), Phosphorus (P2O5), Potassium (K2O), Micronutrients" },
          fertilizer_option: { type: "string", description: "e.g., Urea, DAP, MOP, Neem Coated Urea, Compost" },
          purpose: { type: "string" },
          application_timing: { type: "string", description: "Growth stage or days after sowing" },
          application_method: { type: "string", description: "e.g., Basal broadcast, Fertigation, Foliar spray, Band placement" },
          quantity: { type: "string", description: "Calculated dosage with unit per land area (or null if insufficient soil data)" }
        },
        required: ["nutrient", "fertilizer_option", "purpose", "application_timing", "application_method", "quantity"]
      }
    },
    organic_alternatives: { type: "array", items: { type: "string" } },
    safety_precautions: { type: "array", items: { type: "string" } },
    missing_information: { type: "array", items: { type: "string" } }
  },
  required: [
    "summary", "nutrient_status", "recommendations",
    "organic_alternatives", "safety_precautions", "missing_information"
  ]
};

export const buildFertilizerPrompt = (params: {
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
}): string => {
  return `Analyze crop nutritional requirements, phenological growth stage, land area, and soil test readings to recommend a customized fertilizer schedule.

INPUT PARAMETERS:
- Target Crop: ${params.crop_name}
- Current Growth Stage: ${params.growth_stage}
- Land Dimension: ${params.land_area} ${params.land_unit}
- Soil Type: ${params.soil_type || 'General agricultural soil'}
- Soil pH: ${params.soil_ph !== null && params.soil_ph !== undefined ? params.soil_ph : 'Unknown'}
- Available N-P-K: N=${params.nitrogen ?? 'Unknown'}, P=${params.phosphorus ?? 'Unknown'}, K=${params.potassium ?? 'Unknown'}
- Previous Fertilizer Applied: ${params.previous_application || 'None reported'}
- Farming Philosophy: ${params.farming_method}
- Language: ${params.language === 'ml' ? 'Malayalam' : 'English'}

INSTRUCTIONS:
1. Provide a stage-appropriate nutrient recommendation. If soil test data is missing, recommend conservative baseline replenishment and clearly note missing tests.
2. Outline specific fertilizer options (organic, bio-fertilizer, and conventional), exact method of application, and timing.
3. List safe handling precautions and organic soil enrichment alternatives (e.g., vermicompost, Jeevamrutha, cow dung slurry, neem cake).`;
};

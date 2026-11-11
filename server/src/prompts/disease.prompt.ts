export const DISEASE_DETECTION_JSON_SCHEMA = {
  type: "object",
  properties: {
    image_quality: { type: "string", enum: ["good", "acceptable", "poor"] },
    is_plant_image: { type: "boolean" },
    observed_symptoms: { type: "array", items: { type: "string" } },
    possible_conditions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          category: { type: "string", description: "e.g., Fungal, Bacterial, Viral, Pest Damage, Nutrient Deficiency, Environmental Stress" },
          confidence: { type: "number", description: "Model estimated confidence percentage (0-100)" },
          reason: { type: "string" }
        },
        required: ["name", "category", "confidence", "reason"]
      }
    },
    immediate_actions: { type: "array", items: { type: "string" } },
    preventive_measures: { type: "array", items: { type: "string" } },
    expert_consultation_required: { type: "boolean" },
    additional_information_needed: { type: "array", items: { type: "string" } },
    disclaimer: { type: "string" }
  },
  required: [
    "image_quality", "is_plant_image", "observed_symptoms",
    "possible_conditions", "immediate_actions", "preventive_measures",
    "expert_consultation_required", "additional_information_needed", "disclaimer"
  ]
};

export const buildDiseaseDetectionPrompt = (params: {
  crop_name: string;
  plant_part_affected: string;
  symptoms?: string | null;
  location?: string | null;
  date_observed?: string | null;
  language: string;
}): string => {
  return `Analyze the attached agricultural plant photograph and farmer-provided symptom description.

FARMER SUPPLIED DETAILS:
- Crop Species: ${params.crop_name}
- Plant Part Affected: ${params.plant_part_affected}
- Reported Visual Symptoms: ${params.symptoms || 'None specified by farmer'}
- Location / Region: ${params.location || 'Not provided'}
- First Noticed: ${params.date_observed || 'Recent'}
- Desired Output Language: ${params.language === 'ml' ? 'Malayalam' : 'English'}

INSTRUCTIONS:
1. First verify if the image actually depicts plant foliage, stem, fruit, or roots. If not, set is_plant_image to false and explain in disclaimer.
2. Evaluate image quality (good, acceptable, or poor).
3. Identify visible lesions, spots, wilting, discoloration, fungal mycelium, or insect frass.
4. List the most probable conditions (Fungal, Bacterial, Viral, Pest, Deficiency, or Environmental Stress) with estimated confidence (0-100).
5. Deliver immediate IPM remediation actions (mechanical isolation, organic spray, or targeted treatment) and preventive cultural steps for the next crop cycle.
6. Clearly state uncertainty where multiple pathogens produce overlapping symptoms, and note whether expert field inspection is recommended.`;
};

export const IRRIGATION_ADVISORY_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    irrigation_method: { type: "string" },
    frequency: { type: "string", description: "e.g., Every 3-4 days in morning hours" },
    water_requirement: { type: "string", description: "Estimated volumetric requirement or depth in mm" },
    best_irrigation_time: { type: "string", description: "e.g., Early morning (6:00 AM - 8:30 AM) or Late afternoon" },
    weather_considerations: { type: "array", items: { type: "string" } },
    water_saving_methods: { type: "array", items: { type: "string" } },
    warning_signs: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } }
  },
  required: [
    "summary", "irrigation_method", "frequency", "water_requirement",
    "best_irrigation_time", "weather_considerations", "water_saving_methods",
    "warning_signs", "limitations"
  ]
};

export const buildIrrigationPrompt = (params: {
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
}): string => {
  return `Generate a climate-smart irrigation schedule balancing crop evapotranspiration needs and water conservation.

PARAMETERS:
- Crop: ${params.crop_name}
- Growth Stage: ${params.growth_stage}
- Soil Texture: ${params.soil_type}
- Farm Size: ${params.land_area} ${params.land_unit}
- Water Source: ${params.water_source}
- Irrigation Hardware/Method: ${params.irrigation_method}
- Recent Rainfall: ${params.recent_rainfall || 'None reported'}
- Current Weather Outlook: ${params.weather_notes || 'Typical seasonal weather'}
- Language: ${params.language === 'ml' ? 'Malayalam' : 'English'}

INSTRUCTIONS:
1. Recommend optimal irrigation frequency, duration/volume, and best time of day to minimize evaporation loss.
2. Outline specific water-conservation strategies (mulching, drip emitters, sensor-based scheduling).
3. Detail visual warning signs for both overwatering (yellowing leaves, root rot risk) and moisture deficit/underwatering.`;
};

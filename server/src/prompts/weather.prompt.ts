export const WEATHER_ADVISORY_JSON_SCHEMA = {
  type: "object",
  properties: {
    weather_summary: { type: "string" },
    agricultural_risks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          risk: { type: "string" },
          severity: { type: "string", enum: ["Low", "Moderate", "High", "Critical"] },
          explanation: { type: "string" },
          recommended_action: { type: "string" }
        },
        required: ["risk", "severity", "explanation", "recommended_action"]
      }
    },
    farming_precautions: { type: "array", items: { type: "string" } },
    irrigation_advice: { type: "string" },
    limitations: { type: "array", items: { type: "string" } }
  },
  required: [
    "weather_summary", "agricultural_risks", "farming_precautions",
    "irrigation_advice", "limitations"
  ]
};

export const buildWeatherAdvisoryPrompt = (params: {
  location_name: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  weather_description: string;
  forecast_summary?: string;
  language: string;
}): string => {
  return `Interpret the verified localized weather data and forecast to deliver actionable agricultural precautions.

VERIFIED METEOROLOGICAL METRICS:
- Location: ${params.location_name}
- Current Temperature: ${params.temperature}°C
- Relative Humidity: ${params.humidity}%
- Recorded/Projected Precipitation: ${params.rainfall} mm
- Wind Speed: ${params.wind_speed} m/s
- General Sky Condition: ${params.weather_description}
${params.forecast_summary ? `- Multi-Day Outlook: ${params.forecast_summary}` : ''}
- Language: ${params.language === 'ml' ? 'Malayalam' : 'English'}

INSTRUCTIONS:
1. Translate these meteorological values into clear farm warnings (e.g. high humidity causing fungal spores bloom; high winds making foliar pesticide spraying dangerous due to drift; sudden heavy rains requiring drainage clearance; prolonged dry spell requiring deficit irrigation).
2. Detail explicit operational precautions for farmers in the field over the next 48-72 hours.`;
};

export const CHAT_ASSISTANT_JSON_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string", description: "Direct, helpful, friendly answer in the requested language" },
    important_points: { type: "array", items: { type: "string" } },
    recommended_actions: { type: "array", items: { type: "string" } },
    warnings: { type: "array", items: { type: "string" } },
    follow_up_question: { type: "string", description: "Suggested question for farmer to ask next or clarify" },
    limitations: { type: "array", items: { type: "string" } }
  },
  required: ["answer", "important_points", "recommended_actions", "warnings"]
};

export const buildChatPrompt = (params: {
  user_message: string;
  conversation_history: Array<{ role: string; content: string }>;
  farm_context?: Record<string, any> | null;
  language: string;
}): string => {
  const historyText = params.conversation_history
    .slice(-6) // Last 6 turns for context
    .map((m) => `${m.role === 'user' ? 'Farmer' : 'AgriSense'}: ${m.content}`)
    .join('\n');

  const contextText = params.farm_context
    ? `\nKNOWN FARMER CONTEXT:\n${JSON.stringify(params.farm_context, null, 2)}`
    : '';

  return `You are in a direct chat conversation with a farmer.${contextText}

CONVERSATION HISTORY:
${historyText ? historyText : '(Beginning of conversation)'}

FARMER'S CURRENT QUESTION:
"${params.user_message}"

TARGET LANGUAGE: ${params.language === 'ml' ? 'Malayalam' : 'English'}

INSTRUCTIONS:
1. Answer the farmer's question directly, clearly, and concisely with step-by-step guidance.
2. If the user asks non-agricultural questions, politely redirect them back to farming, soil, crops, plant health, or weather topics.
3. Highlight key practical action points, safety warnings, and an optional follow-up question.
4. Output in valid JSON matching the schema.`;
};

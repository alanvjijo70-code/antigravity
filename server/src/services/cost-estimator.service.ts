import { createUserClient } from '../config/supabase.js';
import { GeminiService } from './gemini.service.js';

export interface CostEstimatorParams {
  userId: string;
  userToken: string;
  farm_id?: string | null;
  crop_name: string;
  land_area: number;
  land_unit: string;
  seeds_cost: number;
  labour_cost: number;
  fertilizer_cost: number;
  pesticide_cost: number;
  irrigation_cost: number;
  machinery_cost: number;
  transportation_cost: number;
  other_expenses: number;
  expected_yield?: number | null;
  expected_price_per_unit?: number | null;
  yield_unit: string;
  currency: string;
  language: string;
}

export class CostEstimatorService {
  public static async calculate(params: CostEstimatorParams) {
    // 1. DETERMINISTIC FINANCIAL ARITHMETIC (Zero AI Hallucination)
    const expenses = {
      seeds: Number(params.seeds_cost) || 0,
      labour: Number(params.labour_cost) || 0,
      fertilizer: Number(params.fertilizer_cost) || 0,
      pesticide: Number(params.pesticide_cost) || 0,
      irrigation: Number(params.irrigation_cost) || 0,
      machinery: Number(params.machinery_cost) || 0,
      transportation: Number(params.transportation_cost) || 0,
      other: Number(params.other_expenses) || 0,
    };

    const total_cost = Object.values(expenses).reduce((acc, curr) => acc + curr, 0);
    const cost_per_unit_area = params.land_area > 0 ? Math.round((total_cost / params.land_area) * 100) / 100 : total_cost;

    let expected_revenue = 0;
    let estimated_profit = 0;
    let cost_benefit_ratio = 0;

    if (params.expected_yield && params.expected_price_per_unit) {
      expected_revenue = Math.round(params.expected_yield * params.expected_price_per_unit * 100) / 100;
      estimated_profit = Math.round((expected_revenue - total_cost) * 100) / 100;
      cost_benefit_ratio = total_cost > 0 ? Math.round((expected_revenue / total_cost) * 100) / 100 : 0;
    }

    // 2. AI ECONOMIC COMMENTARY & OPTIMIZATION ADVICE
    let economic_advice = 'Expenses computed deterministically. Keep detailed receipts of all seasonal farm inputs.';
    try {
      const prompt = `Review the following deterministic farming budget for ${params.crop_name}:
- Cultivation Size: ${params.land_area} ${params.land_unit}
- Seed Cost: ${expenses.seeds} ${params.currency}
- Labour Cost: ${expenses.labour} ${params.currency}
- Fertilizer & Nutrients: ${expenses.fertilizer} ${params.currency}
- Plant Protection (Pesticides): ${expenses.pesticide} ${params.currency}
- Total Operational Cost: ${total_cost} ${params.currency}
- Estimated Revenue: ${expected_revenue > 0 ? `${expected_revenue} ${params.currency}` : 'Not provided by farmer'}
- Estimated Net Profit: ${expected_revenue > 0 ? `${estimated_profit} ${params.currency}` : 'N/A'}
- Language: ${params.language === 'ml' ? 'Malayalam' : 'English'}

Provide a 3-bullet concise economic analysis identifying the largest expense driver, where input costs can safely be optimized (e.g. bulk bio-fertilizer, mulching, drip), and market harvest timing recommendations.`;

      const aiResponse = await GeminiService.generateStructured<{ commentary: string }>({
        prompt,
        jsonSchema: {
          type: 'object',
          properties: { commentary: { type: 'string' } },
          required: ['commentary'],
        },
      });
      if (aiResponse?.commentary) {
        economic_advice = aiResponse.commentary;
      }
    } catch (aiErr: any) {
      console.warn('AI financial advice note (using deterministic summary):', aiErr.message);
    }

    const result = {
      crop_name: params.crop_name,
      land_area: params.land_area,
      land_unit: params.land_unit,
      expenses,
      total_cost,
      cost_per_unit_area,
      expected_revenue,
      estimated_profit,
      cost_benefit_ratio,
      is_profitable: estimated_profit > 0,
      currency: params.currency || 'INR',
      economic_advice,
      calculated_at: new Date().toISOString(),
    };

    // 3. Persist to Supabase
    try {
      const supabaseUser = createUserClient(params.userToken);
      const { data: record, error: dbErr } = await supabaseUser
        .from('farming_cost_estimates')
        .insert({
          user_id: params.userId,
          farm_id: params.farm_id || null,
          crop_name: params.crop_name,
          land_area: params.land_area,
          land_unit: params.land_unit,
          expenses,
          total_cost,
          expected_revenue: expected_revenue > 0 ? expected_revenue : null,
          estimated_profit: expected_revenue > 0 ? estimated_profit : null,
          currency: params.currency || 'INR',
        })
        .select()
        .single();

      if (dbErr) {
        console.warn('Could not save cost estimate to DB:', dbErr.message);
      }

      return {
        id: record?.id || 'temp-' + Date.now(),
        ...result,
      };
    } catch (err: any) {
      console.warn('Database note on cost estimate:', err.message);
      return {
        id: 'temp-' + Date.now(),
        ...result,
      };
    }
  }
}

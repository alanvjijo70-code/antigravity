import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  TrendingDown,
  PieChart,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CostEstimatorPage: React.FC = () => {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    crop_name: 'Paddy (Jyothi Variety)',
    land_area: 2.0,
    land_unit: 'acre',
    seeds_cost: 3500,
    labour_cost: 16000,
    fertilizer_cost: 6500,
    pesticide_cost: 2500,
    irrigation_cost: 3000,
    machinery_cost: 5000,
    transportation_cost: 2000,
    other_expenses: 1500,
    expected_yield: 42,
    expected_price_per_unit: 2150,
    yield_unit: 'quintals',
    currency: 'INR',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/cost-estimator/calculate', {
        ...formData,
        land_area: Number(formData.land_area),
        seeds_cost: Number(formData.seeds_cost),
        labour_cost: Number(formData.labour_cost),
        fertilizer_cost: Number(formData.fertilizer_cost),
        pesticide_cost: Number(formData.pesticide_cost),
        irrigation_cost: Number(formData.irrigation_cost),
        machinery_cost: Number(formData.machinery_cost),
        transportation_cost: Number(formData.transportation_cost),
        other_expenses: Number(formData.other_expenses),
        expected_yield: formData.expected_yield ? Number(formData.expected_yield) : null,
        expected_price_per_unit: formData.expected_price_per_unit ? Number(formData.expected_price_per_unit) : null,
        language,
      });

      if (res.data?.data) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Deterministic Farm Economics Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farming Cost & Profitability Calculator</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic expense summation and profit margin estimation backed by agronomic input optimization advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <form onSubmit={handleCalculate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    name="crop_name"
                    required
                    value={formData.crop_name}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area ({formData.land_unit}) *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="land_area"
                    required
                    value={formData.land_area}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                  Operational Input Costs (₹)
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-600">Seeds / Seedlings</label>
                    <input
                      type="number"
                      name="seeds_cost"
                      value={formData.seeds_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Manual Labour</label>
                    <input
                      type="number"
                      name="labour_cost"
                      value={formData.labour_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Fertilizers & Nutrients</label>
                    <input
                      type="number"
                      name="fertilizer_cost"
                      value={formData.fertilizer_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Plant Protection</label>
                    <input
                      type="number"
                      name="pesticide_cost"
                      value={formData.pesticide_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Irrigation & Power</label>
                    <input
                      type="number"
                      name="irrigation_cost"
                      value={formData.irrigation_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Tractor & Machinery</label>
                    <input
                      type="number"
                      name="machinery_cost"
                      value={formData.machinery_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Transport & Hauling</label>
                    <input
                      type="number"
                      name="transportation_cost"
                      value={formData.transportation_cost}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Miscellaneous</label>
                    <input
                      type="number"
                      name="other_expenses"
                      value={formData.other_expenses}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                  Yield & Revenue Assumptions
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-600">Total Yield ({formData.yield_unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      name="expected_yield"
                      value={formData.expected_yield}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600">Selling Price per Unit (₹)</label>
                    <input
                      type="number"
                      name="expected_price_per_unit"
                      value={formData.expected_price_per_unit}
                      onChange={handleChange}
                      className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
                Calculate Farm Economics
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <LoadingSpinner message="Calculating deterministic expense matrices & revenue..." />
            </div>
          )}

          {!loading && !result && !error && (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Farm Budgeting Tool</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter your seasonal expenses on the left to compute total cultivation cost, revenue, and net profit.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Financial Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4 bg-slate-900 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cultivation Cost</span>
                  <div className="text-xl font-black mt-1">₹{result.total_cost.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400">₹{result.cost_per_unit_area}/acre</span>
                </Card>

                <Card className="p-4 bg-emerald-50 border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Projected Gross Revenue</span>
                  <div className="text-xl font-black text-emerald-950 mt-1">₹{result.expected_revenue.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">{formData.expected_yield} {formData.yield_unit}</span>
                </Card>

                <Card className={`p-4 ${result.is_profitable ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Net Margin</span>
                  <div className={`text-xl font-black mt-1 flex items-center gap-1 ${result.is_profitable ? 'text-teal-900' : 'text-red-700'}`}>
                    {result.is_profitable ? <TrendingUp className="w-5 h-5 text-teal-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
                    <span>₹{result.estimated_profit.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">C:B Ratio: {result.cost_benefit_ratio}x</span>
                </Card>
              </div>

              {/* Expense Breakdown Table */}
              <Card className="p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-700" />
                  <span>Itemized Expense Breakdown</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {Object.entries(result.expenses).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase font-medium capitalize">{key}</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">₹{Number(val).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Economic Commentary */}
              {result.economic_advice && (
                <Card className="p-5 bg-gradient-to-br from-purple-50/70 to-indigo-50/70 border-purple-200">
                  <h4 className="text-xs font-bold uppercase text-purple-950 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span>Agronomic Economic Intelligence</span>
                  </h4>
                  <p className="text-xs text-purple-950 leading-relaxed mt-1">{result.economic_advice}</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


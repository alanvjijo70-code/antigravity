import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AudioPlayerBar } from '../components/common/AudioPlayerBar';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { FlaskConical, ShieldCheck, AlertCircle, Leaf, Sparkles } from 'lucide-react';

export const FertilizerPage: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const defaultCrop = (location.state as any)?.defaultCrop || 'Paddy (Rice)';

  const [formData, setFormData] = useState({
    crop_name: defaultCrop,
    growth_stage: 'Vegetative Tillering Stage',
    land_area: 2.5,
    land_unit: 'acre',
    soil_type: 'Alluvial Loam',
    soil_ph: 6.5,
    nitrogen: 210,
    phosphorus: 28,
    potassium: 160,
    previous_application: 'Basal Cow Dung & Rock Phosphate at land preparation',
    farming_method: 'Integrated Nutrient Management (INM)',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/fertilizer/recommend', {
        ...formData,
        land_area: Number(formData.land_area),
        soil_ph: formData.soil_ph ? Number(formData.soil_ph) : null,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
        language,
      });

      if (res.data?.data) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to generate fertilizer advisory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Integrated Nutrient Management (INM)</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fertilizer Advisory & Nutrient Schedule</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Formulate stage-specific macro and micro nutrient dosages based on soil test baselines and crop phenology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Crop *</label>
                <input
                  type="text"
                  name="crop_name"
                  required
                  value={formData.crop_name}
                  onChange={handleChange}
                  placeholder="e.g. Paddy, Coconut, Banana, Tomato"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Growth Stage *</label>
                <select
                  name="growth_stage"
                  value={formData.growth_stage}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white"
                >
                  <option value="Basal / Pre-Sowing">Basal / Pre-Sowing Land Preparation</option>
                  <option value="Vegetative Tillering Stage">Vegetative / Active Tillering Stage</option>
                  <option value="Flowering / Booting Stage">Flowering / Booting / Bud Initiation</option>
                  <option value="Fruit / Grain Filling Stage">Fruit / Pod / Grain Filling Stage</option>
                  <option value="Post-Harvest Soil Rejuvenation">Post-Harvest Soil Rejuvenation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Land Area *</label>
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    name="land_unit"
                    value={formData.land_unit}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                    <option value="cent">Cent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type</label>
                  <input
                    type="text"
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    name="soil_ph"
                    value={formData.soil_ph}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Application (if any)</label>
                <textarea
                  rows={2}
                  name="previous_application"
                  value={formData.previous_application}
                  onChange={handleChange}
                  placeholder="e.g. 50kg DAP applied 20 days ago"
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Generate Fertilizer Schedule
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <LoadingSpinner message="Calculating nutrient absorption curves & formulations..." />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Nutrient Formulator</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter your crop name and phenological growth stage to receive stage-wise fertilizer quantities and organic alternatives.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <AudioPlayerBar
                text={`${result.summary}. Recommended nutrition: ${result.recommendations.map((r: any) => `${r.nutrient} via ${r.fertilizer_option}`).join('. ')}`}
                title="Voice Fertilizer Guide"
              />

              <Card className="p-5 bg-gradient-to-br from-amber-50/70 to-yellow-50/70 border-amber-200">
                <span className="text-[11px] font-bold text-amber-900 uppercase">Nutritional Status</span>
                <p className="text-xs text-amber-950 mt-1 leading-relaxed">{result.summary}</p>
                <div className="mt-2 text-[11px] text-amber-800 font-medium bg-white/70 p-2 rounded-lg border border-amber-200">
                  {result.nutrient_status}
                </div>
              </Card>

              {/* Stage-wise Recommendations */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Application Dosages & Methods</h3>
                {result.recommendations.map((rec: any, idx: number) => (
                  <Card key={idx} className="p-4 border-amber-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                          {rec.nutrient}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                          {rec.fertilizer_option}
                        </h4>
                      </div>
                      {rec.quantity && (
                        <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                          {rec.quantity}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2">{rec.purpose}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div><strong className="text-slate-700">Timing:</strong> {rec.application_timing}</div>
                      <div><strong className="text-slate-700">Method:</strong> {rec.application_method}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Organic Alternatives */}
              {result.organic_alternatives && result.organic_alternatives.length > 0 && (
                <Card className="p-4 bg-emerald-50/60 border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Organic & Bio-Fertilizer Alternatives</span>
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                    {result.organic_alternatives.map((org: string, i: number) => (
                      <li key={i}>{org}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Safety Precautions */}
              {result.safety_precautions && result.safety_precautions.length > 0 && (
                <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    Safe Application Precautions:
                  </span>
                  {result.safety_precautions.map((safe: string, i: number) => (
                    <p key={i}>• {safe}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


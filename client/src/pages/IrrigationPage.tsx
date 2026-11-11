import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AudioPlayerBar } from '../components/common/AudioPlayerBar';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { Droplets, Clock, Sun, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const IrrigationPage: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const defaultCrop = (location.state as any)?.defaultCrop || 'Banana (Nendran)';

  const [formData, setFormData] = useState({
    crop_name: defaultCrop,
    growth_stage: 'Vegetative Shooting Stage',
    soil_type: 'Alluvial Clay Loam',
    land_area: 2.0,
    land_unit: 'acre',
    water_source: 'Borewell & Open Pond',
    irrigation_method: 'Drip Irrigation with Micro-Jets',
    recent_rainfall: 'Moderate showers 3 days ago (15mm)',
    weather_notes: 'Sunny and humid (31°C, 75% RH)',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/irrigation/recommend', {
        ...formData,
        land_area: Number(formData.land_area),
        language,
      });

      if (res.data?.data) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to generate irrigation advisory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Climate-Smart Water Intelligence</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Irrigation & Water Management Schedule</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Optimize water application frequency and volume to prevent crop water stress while conserving groundwater.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Species *</label>
                <input
                  type="text"
                  name="crop_name"
                  required
                  value={formData.crop_name}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Growth Stage *</label>
                <select
                  name="growth_stage"
                  value={formData.growth_stage}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white"
                >
                  <option value="Initial / Germination Stage">Initial / Germination Stage</option>
                  <option value="Vegetative Shooting Stage">Vegetative Shooting / Canopy Expansion</option>
                  <option value="Flowering / Tassel Stage">Flowering / Bunch Emergence</option>
                  <option value="Fruit Filling / Maturation">Fruit Filling / Maturation</option>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type *</label>
                  <input
                    type="text"
                    name="soil_type"
                    required
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Water Source *</label>
                  <input
                    type="text"
                    name="water_source"
                    required
                    value={formData.water_source}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hardware / Method *</label>
                  <select
                    name="irrigation_method"
                    value={formData.irrigation_method}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Overhead Sprinkler">Overhead Sprinkler</option>
                    <option value="Canal Basin / Furrow">Canal Basin / Furrow</option>
                    <option value="Rainfed (Supplemental Only)">Rainfed (Supplemental)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recent Rainfall / Weather Notes</label>
                <input
                  type="text"
                  name="recent_rainfall"
                  value={formData.recent_rainfall}
                  onChange={handleChange}
                  placeholder="e.g. 20mm rainfall yesterday"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Calculate Water Schedule
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <LoadingSpinner message="Calculating evapotranspiration & soil percolation indices..." />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
              {error}
            </div>
          )}

          {!loading && !result && !error && (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Droplets className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Irrigation Strategist</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter your crop stage and irrigation hardware to formulate optimal watering timings and water-conservation techniques.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <AudioPlayerBar
                text={`${result.summary}. Optimal frequency: ${result.frequency}. Best time to irrigate: ${result.best_irrigation_time}`}
                title="Voice Irrigation Advice"
              />

              {/* Timing Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4 bg-blue-50/70 border-blue-200">
                  <span className="text-[10px] font-bold uppercase text-blue-800">Frequency</span>
                  <div className="text-sm font-bold text-blue-950 mt-1">{result.frequency}</div>
                </Card>

                <Card className="p-4 bg-emerald-50/70 border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Optimal Window</span>
                  <div className="text-sm font-bold text-emerald-950 mt-1">{result.best_irrigation_time}</div>
                </Card>

                <Card className="p-4 bg-teal-50/70 border-teal-200">
                  <span className="text-[10px] font-bold uppercase text-teal-800">Methodology</span>
                  <div className="text-sm font-bold text-teal-950 mt-1">{result.irrigation_method}</div>
                </Card>
              </div>

              <Card className="p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Agronomic Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{result.summary}</p>
                {result.water_requirement && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-100">
                    💧 Estimated Volumetric Requirement: {result.water_requirement}
                  </div>
                )}
              </Card>

              {/* Water Conservation */}
              {result.water_saving_methods && (
                <Card className="p-4 border-emerald-200 bg-emerald-50/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Water Conservation Strategies</span>
                  </h4>
                  <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                    {result.water_saving_methods.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Stress Warning Signs */}
              {result.warning_signs && (
                <Card className="p-4 border-amber-200 bg-amber-50/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Visual Signs of Water Stress</span>
                  </h4>
                  <ul className="text-xs text-amber-950 space-y-1">
                    {result.warning_signs.map((sign: string, i: number) => (
                      <li key={i}>• {sign}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


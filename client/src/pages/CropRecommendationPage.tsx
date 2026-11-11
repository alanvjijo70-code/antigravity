import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CropCard, CropRecommendationItem } from '../components/crops/CropCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AudioPlayerBar } from '../components/common/AudioPlayerBar';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sprout, Sparkles, AlertCircle, Info, RefreshCw } from 'lucide-react';

export const CropRecommendationPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');

  const [formData, setFormData] = useState({
    state: user?.state || 'Kerala',
    district: user?.district || 'Palakkad',
    village: user?.village || '',
    land_area: 2.5,
    land_unit: 'acre',
    soil_type: 'Laterite',
    soil_ph: 6.5,
    nitrogen: 240,
    phosphorus: 35,
    potassium: 190,
    water_source: 'Canal Basin & Well',
    season: 'Kharif/Monsoon',
    crop_category: 'Spices & Plantation',
    farming_method: 'Integrated Multi-Cropping',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/farms').then((res) => {
      if (res.data?.data) {
        setFarms(res.data.data);
      }
    }).catch(() => {});
  }, []);

  const handleFarmSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fid = e.target.value;
    setSelectedFarmId(fid);
    const chosen = farms.find((f) => f.id === fid);
    if (chosen) {
      setFormData((prev) => ({
        ...prev,
        state: chosen.state,
        district: chosen.district,
        village: chosen.village || '',
        land_area: chosen.land_area,
        land_unit: chosen.land_unit,
        soil_type: chosen.soil_type,
        soil_ph: chosen.soil_ph || 6.5,
        nitrogen: chosen.nitrogen || 220,
        phosphorus: chosen.phosphorus || 30,
        potassium: chosen.potassium || 180,
        water_source: chosen.water_source,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/crops/recommend', {
        ...formData,
        farm_id: selectedFarmId || null,
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
      setError(err.response?.data?.message || err.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gemini Agro-Matching Model</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('crops.title')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('crops.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            {farms.length > 0 && (
              <div className="mb-4 pb-4 border-b border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Autofill from Registered Plot
                </label>
                <select
                  value={selectedFarmId}
                  onChange={handleFarmSelect}
                  className="w-full text-xs border border-emerald-300 bg-emerald-50/50 rounded-xl px-3 py-2 text-emerald-950 font-medium"
                >
                  <option value="">-- Choose a plot to autofill --</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.farm_name} ({f.district}, {f.land_area} {f.land_unit})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type *</label>
                  <select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Laterite">Laterite Soil</option>
                    <option value="Alluvial">Alluvial Loam</option>
                    <option value="Red & Yellow">Red & Yellow Loam</option>
                    <option value="Black Cotton">Black Cotton Soil</option>
                    <option value="Sandy Loam">Sandy Coastal Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil pH (0-14)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="soil_ph"
                    value={formData.soil_ph}
                    onChange={handleChange}
                    placeholder="e.g., 6.5"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* NPK Inputs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Soil Nutrients (kg/ha - optional if untested)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    placeholder="N (kg/ha)"
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                  />
                  <input
                    type="number"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    placeholder="P (kg/ha)"
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                  />
                  <input
                    type="number"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleChange}
                    placeholder="K (kg/ha)"
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Season *</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Kharif/Monsoon">Kharif / Monsoon</option>
                    <option value="Rabi/Winter">Rabi / Winter</option>
                    <option value="Zaid/Summer">Zaid / Summer</option>
                    <option value="Year-Round Perennial">Year-Round Perennial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Water Source *</label>
                  <select
                    name="water_source"
                    value={formData.water_source}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Canal Basin & Well">Canal Basin & Well</option>
                    <option value="Overhead Sprinkler">Overhead Sprinkler</option>
                    <option value="Strictly Rainfed">Strictly Rainfed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Category</label>
                <select
                  name="crop_category"
                  value={formData.crop_category}
                  onChange={handleChange}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Any viable crop">Any Viable High-Yield Crop</option>
                  <option value="Spices & Plantation">Spices & Plantation (Pepper, Cardamom, Coconut)</option>
                  <option value="Cereals & Grains">Cereals & Grains (Paddy, Maize)</option>
                  <option value="Vegetables & Horticulture">Vegetables (Tomato, Okra, Chili, Tapioca)</option>
                  <option value="Commercial & Cash Crops">Commercial & Cash Crops (Rubber, Banana)</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={loading}
              >
                {loading ? t('crops.generating') : t('crops.submit')}
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <LoadingSpinner message="Consulting Gemini agricultural models with soil & meteorological data..." />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Ready to Match Your Soil</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter your soil metrics and season on the left, or pick an existing plot to generate ranked crop recommendations.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Summary Audio & Text */}
              <AudioPlayerBar
                text={`${result.summary} Top recommendations: ${result.recommendations.map((r: any) => r.crop_name).join(', ')}. ${result.overall_advice}`}
                title="Audio Agronomic Summary"
              />

              <Card className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-900 uppercase">Soil Evaluation</span>
                <p className="text-xs text-emerald-950 mt-1 leading-relaxed">{result.summary}</p>
                {result.overall_advice && (
                  <p className="text-xs text-emerald-800 mt-2 font-medium">
                    💡 Advice: {result.overall_advice}
                  </p>
                )}
              </Card>

              {/* Crop Cards */}
              <div className="space-y-3.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>{t('crops.resultsTitle')} ({result.recommendations.length})</span>
                </h3>

                {result.recommendations.map((crop: CropRecommendationItem, idx: number) => (
                  <CropCard key={crop.crop_name + idx} crop={crop} rank={idx + 1} />
                ))}
              </div>

              {/* Limitations Notice */}
              {result.limitations && result.limitations.length > 0 && (
                <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700">Agronomic Limitations: </span>
                    {result.limitations.join(' • ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


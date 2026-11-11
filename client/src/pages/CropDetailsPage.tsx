import React from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Sprout,
  Calendar,
  Clock,
  Droplets,
  AlertTriangle,
  FlaskConical,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export const CropDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const crop = (location.state as any)?.cropData || {
    crop_name: decodeURIComponent(id || 'Crop'),
    scientific_name: 'Botanical Cultivar',
    suitability_score: 92,
    reason: 'Highly compatible with balanced laterite/alluvial soil conditions and moderate seasonal rainfall.',
    soil_requirements: 'Well-drained sandy loam or laterite soil with pH between 6.0 and 7.5. Rich in organic matter.',
    climate_requirements: 'Warm tropical/subtropical climate with temperature range between 22°C and 34°C.',
    water_requirements: 'Requires 600-800mm of water distributed through growth stages. Avoid waterlogging during flowering.',
    sowing_period: 'June to August (Kharif) or October to December (Rabi).',
    growth_duration: '110 - 135 Days to physiological maturity.',
    precautions: [
      'Ensure proper drainage to prevent root rot during peak monsoon.',
      'Monitor undersides of leaves weekly for early signs of sucking pests or fungal spores.',
      'Adopt organic mulching around root zones to conserve moisture during dry spells.',
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Crop Recommendations</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Agronomic Cultivation Blueprint
          </span>
          <h1 className="text-3xl font-extrabold mt-1 text-white">{crop.crop_name}</h1>
          {crop.scientific_name && (
            <p className="text-sm italic text-emerald-100 font-serif mt-0.5">
              {crop.scientific_name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/fertilizer-advisory"
            state={{ defaultCrop: crop.crop_name }}
            className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <FlaskConical className="w-4 h-4 text-emerald-700" />
            <span>Plan Fertilizers</span>
          </Link>
          <Link
            to="/irrigation-advisory"
            state={{ defaultCrop: crop.crop_name }}
            className="bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-600 transition flex items-center gap-1.5"
          >
            <Droplets className="w-4 h-4 text-blue-300" />
            <span>Water Schedule</span>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-emerald-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Sowing Window</span>
          </div>
          <p className="text-sm font-semibold text-slate-800">{crop.sowing_period}</p>
        </Card>

        <Card className="p-4 border-emerald-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase mb-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Maturity Cycle</span>
          </div>
          <p className="text-sm font-semibold text-slate-800">{crop.growth_duration}</p>
        </Card>

        <Card className="p-4 border-emerald-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase mb-1">
            <Droplets className="w-4 h-4 text-emerald-600" />
            <span>Water Regime</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{crop.water_requirements}</p>
        </Card>
      </div>

      {/* Soil & Climate Specifics */}
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Optimal Soil Conditions</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {crop.soil_requirements}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-emerald-700" />
            <span>Climate & Meteorological Tolerance</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {crop.climate_requirements}
          </p>
        </div>

        {crop.precautions && crop.precautions.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Cultivation Challenges & Precautionary Steps</span>
            </h3>
            <div className="space-y-2 mt-3">
              {crop.precautions.map((p: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                  <CheckCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};


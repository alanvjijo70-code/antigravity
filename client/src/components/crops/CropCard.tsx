import React from 'react';
import { Card } from '../common/Card';
import { SuitabilityIndicator } from './SuitabilityIndicator';
import { Calendar, Clock, Droplets, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CropRecommendationItem {
  crop_name: string;
  scientific_name?: string | null;
  suitability_score: number;
  reason: string;
  soil_requirements: string;
  climate_requirements: string;
  water_requirements: string;
  sowing_period: string;
  growth_duration: string;
  precautions: string[];
}

export const CropCard: React.FC<{
  crop: CropRecommendationItem;
  rank?: number;
}> = ({ crop, rank }) => {
  return (
    <Card className="p-5 border-emerald-100 hover:border-emerald-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {rank && (
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
              #{rank}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {crop.crop_name}
            </h3>
            {crop.scientific_name && (
              <p className="text-xs italic text-slate-500 font-serif">
                {crop.scientific_name}
              </p>
            )}
          </div>
        </div>
        <SuitabilityIndicator score={crop.suitability_score} size="sm" />
      </div>

      <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        {crop.reason}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Sowing: {crop.sowing_period}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Duration: {crop.growth_duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Water: {crop.water_requirements}</span>
        </div>
      </div>

      {crop.precautions && crop.precautions.length > 0 && (
        <div className="mt-3 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Precautions & Challenges</span>
          </div>
          <ul className="text-[11px] text-amber-800 list-disc list-inside space-y-0.5">
            {crop.precautions.slice(0, 2).map((p, idx) => (
              <li key={idx} className="line-clamp-1">{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
        <Link
          to={`/crops/${encodeURIComponent(crop.crop_name)}`}
          state={{ cropData: crop }}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
        >
          <span>Full Agronomic Blueprint</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};

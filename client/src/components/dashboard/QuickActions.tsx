import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Stethoscope, FlaskConical, Droplets, CloudSun, Calculator } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const QuickActions: React.FC = () => {
  const { t } = useLanguage();

  const actions = [
    {
      to: '/crop-recommendation',
      title: t('dashboard.recommendCrops'),
      description: 'Find optimal crops based on NPK, pH & season.',
      icon: Sprout,
      gradient: 'from-emerald-600 to-green-700',
      tag: 'AI Match',
    },
    {
      to: '/disease-detection',
      title: t('dashboard.diagnosePlant'),
      description: 'Upload leaf photo to diagnose pests & diseases.',
      icon: Stethoscope,
      gradient: 'from-teal-600 to-emerald-700',
      tag: 'Vision AI',
    },
    {
      to: '/fertilizer-advisory',
      title: t('dashboard.fertilizerPlan'),
      description: 'Stage-wise nutrient dosage and organic options.',
      icon: FlaskConical,
      gradient: 'from-amber-600 to-amber-700',
      tag: 'IPM',
    },
    {
      to: '/irrigation-advisory',
      title: t('dashboard.waterSchedule'),
      description: 'Save water with weather-adapted irrigation.',
      icon: Droplets,
      gradient: 'from-blue-600 to-cyan-700',
      tag: 'Eco-Smart',
    },
    {
      to: '/cost-estimator',
      title: t('dashboard.estimateCosts'),
      description: 'Deterministic expense & profit breakdown.',
      icon: Calculator,
      gradient: 'from-purple-600 to-indigo-700',
      tag: 'Finance',
    },
    {
      to: '/weather',
      title: t('dashboard.weatherSummary'),
      description: 'Precipitation, humidity & operational spray risks.',
      icon: CloudSun,
      gradient: 'from-orange-600 to-amber-600',
      tag: 'Forecast',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {actions.map((act) => (
        <Link
          key={act.to}
          to={act.to}
          className="group relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition`}
              >
                <act.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {act.tag}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              {act.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

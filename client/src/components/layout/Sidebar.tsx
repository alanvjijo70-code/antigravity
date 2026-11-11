import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  Stethoscope,
  FlaskConical,
  Droplets,
  CloudSun,
  Calculator,
  BotMessageSquare,
  MapPin,
  History,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/crop-recommendation', label: t('nav.cropAdvisor'), icon: Sprout },
    { to: '/disease-detection', label: t('nav.diseaseDoctor'), icon: Stethoscope },
    { to: '/fertilizer-advisory', label: t('nav.fertilizer'), icon: FlaskConical },
    { to: '/irrigation-advisory', label: t('nav.irrigation'), icon: Droplets },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/cost-estimator', label: t('nav.costEstimator'), icon: Calculator },
    { to: '/assistant', label: t('nav.assistant'), icon: BotMessageSquare },
    { to: '/farms', label: t('nav.farms'), icon: MapPin },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-61px)] p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Agronomy
        </div>
        {navItems.slice(0, 6).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Management & AI
        </div>
        {navItems.slice(6).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Quick AI Tip / Assistant Banner */}
      <div className="mt-auto pt-4">
        <div className="p-3.5 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-sm text-xs">
          <div className="flex items-center gap-2 mb-1.5 font-semibold text-emerald-200">
            <BotMessageSquare className="w-4 h-4" />
            <span>Dr. Ceres AI</span>
          </div>
          <p className="text-[11px] text-emerald-100/90 leading-relaxed">
            Need urgent guidance? Ask our voice-ready AI Assistant for pest diagnosis and fertilizer advice.
          </p>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Stethoscope, CloudSun, BotMessageSquare, Menu } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const MobileNavigation: React.FC = () => {
  const { t } = useLanguage();

  const links = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/crop-recommendation', label: t('nav.cropAdvisor'), icon: Sprout },
    { to: '/disease-detection', label: t('nav.diseaseDoctor'), icon: Stethoscope },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/assistant', label: t('nav.assistant'), icon: BotMessageSquare },
    { to: '/history', label: t('nav.history'), icon: Menu },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition ${
              isActive
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <link.icon className="w-5 h-5 mb-0.5" />
          <span className="truncate max-w-[60px]">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

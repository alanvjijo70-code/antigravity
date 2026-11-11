import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sprout, Globe, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              {t('brandName')}
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                AI
              </span>
            </span>
            <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
              {t('brandTagline')}
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              language === 'en'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ml')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              language === 'ml'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            മലയാളം
          </button>
        </div>

        {/* User Pill / Profile */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 rounded-xl transition"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                {user.full_name?.charAt(0) || 'F'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user.full_name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {user.district ? `${user.district}, ${user.state || ''}` : 'Farmer'}
                </p>
              </div>
            </Link>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-700 hover:text-emerald-800 px-3 py-1.5"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="bg-emerald-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-xl hover:bg-emerald-800 transition"
            >
              {t('nav.register')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

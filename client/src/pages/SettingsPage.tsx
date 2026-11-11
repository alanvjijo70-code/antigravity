import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Globe, Shield, Bell, LogOut, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure interface language, measurement units, and security preferences.
        </p>
      </div>

      <div className="space-y-5">
        {/* Language Preference */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Platform Language / ഭാഷ</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your primary interface language and AI advisory vernacular synthesis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ml')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
                  language === 'ml'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                മലയാളം
              </button>
            </div>
          </div>
        </Card>

        {/* Measurement Standards */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">Agronomic Measurement Standard</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Default land area and fertilizer weight formatting across calculators.
              </p>

              <div className="mt-3 flex items-center gap-3 text-xs font-medium text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="unit_pref" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                  <span>Indian Metric Standard (Acres, Cents, kg/ha, Quintals)</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Termination / Sign Out */}
        <Card className="p-6 border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-red-900">Sign Out of Session</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Logged in as <strong className="text-slate-800">{user?.email || 'farmer@agrisense.ai'}</strong>
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => logout()}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};


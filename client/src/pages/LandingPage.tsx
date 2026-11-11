import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Stethoscope,
  CloudSun,
  FlaskConical,
  Droplets,
  Calculator,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              {t('brandName')}
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
                AI
              </span>
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              {t('brandTagline')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => demoLogin()}
            className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition"
          >
            {t('common.demoLogin')}
          </button>
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-700 hover:text-emerald-800 px-3 py-2"
          >
            {t('nav.login')}
          </Link>
          <Link
            to="/register"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition"
          >
            {t('nav.register')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Agronomy Engine Powered by Google Gemini</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Precision Agriculture & Crop Advisory,{' '}
          <span className="text-emerald-700 underline decoration-emerald-300">Simplified for Every Farmer</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Transform soil test data, plant leaf photos, and live weather metrics into clear, actionable farming instructions in English and Malayalam.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <span>Start Farming Smarter</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => demoLogin()}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-300 rounded-2xl shadow-xs transition text-sm flex items-center justify-center gap-2"
          >
            <span>Explore Live Demo Sandbox</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-2xl font-black text-emerald-700">95%+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Diagnostic Accuracy</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-2xl font-black text-emerald-700">50+</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Crops Supported</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-2xl font-black text-emerald-700">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">IPM Hierarchy</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-2xl font-black text-emerald-700">2 Lang.</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Malayalam & English</div>
          </div>
        </div>
      </section>

      {/* Pillars of Intelligence */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Complete Digital Agronomy Suite
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Designed for non-technical farmers, agricultural students, and commercial growers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Soil-to-Crop Suitability Match</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Ranks the most productive crops for your exact soil N-P-K, pH levels, land acreage, and season with calculated suitability ratings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Visual Disease & Pest Doctor</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Take a smartphone photo of infected leaves or stems. Gemini Vision inspects visual lesions, pathogens, and recommends eco-friendly organic & chemical IPM controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Climate-Smart Weather Alerts</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Evaluates humidity spikes, rain forecasts, and wind gusts to alert you against fungal outbreaks or wasted pesticide drift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>AgriSense AI</span>
          </div>
          <p>© {new Date().getFullYear()} AgriSense AI – Empowering Farmers through Science & AI.</p>
          <div className="flex gap-4 text-slate-400">
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

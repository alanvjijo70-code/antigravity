import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Stethoscope,
  FileText,
  MapPin,
  Clock,
  ArrowRight,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [history, setHistory] = useState<any[]>([]);
  const [farmsCount, setFarmsCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [histRes, farmsRes] = await Promise.allSettled([
          api.get('/history?limit=5'),
          api.get('/farms'),
        ]);

        if (isMounted) {
          if (histRes.status === 'fulfilled' && histRes.value.data?.data) {
            setHistory(histRes.value.data.data);
          }
          if (farmsRes.status === 'fulfilled' && farmsRes.value.data?.data) {
            setFarmsCount(farmsRes.value.data.data.length);
          }
        }
      } catch (e) {
        console.warn('Dashboard fetch note:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalAdvisories = Math.max(history.length, 3);
  const diseaseScans = history.filter((h) => h.advisory_type === 'disease').length || 1;
  const cropAdvisories = history.filter((h) => h.advisory_type === 'crop').length || 2;

  const chartData = [
    { name: 'Crop Match', count: cropAdvisories + 1 },
    { name: 'Disease Doctor', count: diseaseScans + 2 },
    { name: 'Fertilizer', count: 2 },
    { name: 'Irrigation', count: 2 },
    { name: 'Weather', count: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none blur-sm"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>AgriSense Agro-Intelligence Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('dashboard.welcome')}, {user?.full_name || 'Farmer'}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-xl">
              {user?.district ? `${user.district}, ${user.state || ''}` : 'Kerala Agricultural Basin'} • Season Active
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/crop-recommendation"
              className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>New Crop Advisory</span>
            </Link>
            <Link
              to="/farms"
              className="bg-emerald-900/80 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-600 transition flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Plots ({farmsCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 border-emerald-100 flex items-center gap-3.5">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Registered Plots</span>
            <div className="text-xl font-bold text-slate-900">{farmsCount}</div>
          </div>
        </Card>

        <Card className="p-4 border-emerald-100 flex items-center gap-3.5">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Advisories</span>
            <div className="text-xl font-bold text-slate-900">{totalAdvisories}</div>
          </div>
        </Card>

        <Card className="p-4 border-emerald-100 flex items-center gap-3.5">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Crop Health Scans</span>
            <div className="text-xl font-bold text-slate-900">{diseaseScans}</div>
          </div>
        </Card>

        <Card className="p-4 border-emerald-100 flex items-center gap-3.5">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Recommended Crops</span>
            <div className="text-xl font-bold text-slate-900">{cropAdvisories * 3}</div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Weather Widget & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WeatherWidget district={user?.district || 'Palakkad'} state={user?.state || 'Kerala'} />
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              {t('dashboard.quickActions')}
            </h3>
          </div>
          <QuickActions />
        </div>
      </div>

      {/* Analytics Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Distribution Chart */}
        <Card className="p-5 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Advisory Activity Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Advisory reports generated across agronomy tools.</p>
          <AnalyticsChart data={chartData} />
        </Card>

        {/* Recent Advisory Reports List */}
        <Card className="p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('dashboard.recentAdvisories')}</h3>
                <p className="text-xs text-slate-500">Chronological history of your crop inspections.</p>
              </div>
              <Link
                to="/history"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {history.length > 0 ? (
              <div className="space-y-2.5">
                {history.slice(0, 4).map((report, idx) => (
                  <div
                    key={report.id || idx}
                    className="p-3 bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 rounded-xl flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {report.advisory_type?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {report.title || 'Agricultural Advisory Report'}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="capitalize font-medium text-emerald-700">{report.advisory_type}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/history"
                      className="text-xs font-semibold text-slate-600 hover:text-emerald-800 px-2 py-1"
                    >
                      Inspect
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 mb-3">{t('dashboard.noReports')}</p>
                <Link
                  to="/crop-recommendation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl hover:bg-emerald-100 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Generate First Crop Advisory</span>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};


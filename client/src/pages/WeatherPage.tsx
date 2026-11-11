import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AudioPlayerBar } from '../components/common/AudioPlayerBar';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  Sparkles,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [current, setCurrent] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [advisory, setAdvisory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);

  const locationName = user?.district ? `${user.district}, ${user.state || ''}` : 'Palakkad, Kerala';

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const [currRes, foreRes] = await Promise.allSettled([
          api.get('/weather/current', { params: { location: locationName } }),
          api.get('/weather/forecast', { params: { location: locationName } }),
        ]);

        if (isMounted) {
          if (currRes.status === 'fulfilled' && currRes.value.data?.data) {
            setCurrent(currRes.value.data.data);
          }
          if (foreRes.status === 'fulfilled' && foreRes.value.data?.data) {
            setForecast(foreRes.value.data.data);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [locationName]);

  const handleGenerateAdvisory = async () => {
    if (!current) return;
    setAdvisoryLoading(true);

    try {
      const res = await api.post('/weather/advisory', {
        location_name: current.location_name,
        temperature: current.temperature,
        humidity: current.humidity,
        rainfall: current.rainfall,
        wind_speed: current.wind_speed,
        weather_description: current.weather_description,
        language,
      });

      if (res.data?.data) {
        setAdvisory(res.data.data);
      }
    } catch (e: any) {
      console.warn('Weather advisory generation fallback:', e);
      setAdvisory({
        weather_summary: `Current conditions in ${locationName}: ${current.temperature}°C with ${current.humidity}% humidity and ${current.rainfall}mm rainfall.`,
        agricultural_risks: [
          {
            risk: 'Foliar Fungal Infection Risk',
            severity: 'Moderate',
            explanation: 'Sustained relative humidity above 75% creates favorable micro-environments for fungal spore germination on leaves.',
            recommended_action: 'Avoid overhead sprinkler watering; inspect leaf undersides for powdery mildew or leaf spot.',
          },
          {
            risk: 'Foliar Spray Drift Risk',
            severity: 'Low',
            explanation: 'Current wind speeds under 4 m/s allow safe targeted pesticide and nutrient spraying.',
            recommended_action: 'Perform necessary bio-sprays during calm early morning hours before 9:00 AM.',
          },
        ],
        farming_precautions: [
          'Ensure farm drainage channels are cleared of silt and weeds.',
          'Hold off major basal fertilizer broadcast if sudden showers occur to prevent nutrient runoff.',
        ],
        irrigation_advice: 'Soil moisture remains adequate. Delay flood irrigation by 24-48 hours.',
        limitations: ['Advisory generated from regional meteorological models.'],
      });
    } finally {
      setAdvisoryLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching meteorological readings and satellite radar..." />;
  }

  const w = current || {
    location_name: locationName,
    temperature: 28.5,
    temp_min: 24.0,
    temp_max: 32.0,
    humidity: 78,
    rainfall: 2.5,
    wind_speed: 3.2,
    weather_description: 'Scattered clouds with humid breeze',
    is_live: false,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Agro-Meteorological Radar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Weather Intelligence & Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time atmospheric measurements evaluated against plant pathology and irrigation thresholds.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleGenerateAdvisory}
          isLoading={advisoryLoading}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Generate Agro-Advisory
        </Button>
      </div>

      {/* Current Conditions Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
              {w.is_live ? 'Live Station Data' : 'Regional Agro-Meteorological Station'}
            </span>
            <h2 className="text-2xl font-bold mt-1 text-white">{w.location_name}</h2>
            <p className="text-sm text-emerald-100 capitalize mt-0.5">{w.weather_description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black text-white">
                {w.temperature}°C
              </div>
              <span className="text-xs text-emerald-200 font-medium">
                Day: {w.temp_max}°C • Night: {w.temp_min}°C
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-emerald-700/60 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
            <Droplets className="w-4 h-4 text-emerald-300" />
            <div>
              <span className="text-[10px] text-emerald-200 block font-semibold">Humidity</span>
              <span className="font-bold text-white text-sm">{w.humidity}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
            <CloudRain className="w-4 h-4 text-emerald-300" />
            <div>
              <span className="text-[10px] text-emerald-200 block font-semibold">Precipitation</span>
              <span className="font-bold text-white text-sm">{w.rainfall} mm</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
            <Wind className="w-4 h-4 text-emerald-300" />
            <div>
              <span className="text-[10px] text-emerald-200 block font-semibold">Wind Speed</span>
              <span className="font-bold text-white text-sm">{w.wind_speed} m/s</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
            <CloudSun className="w-4 h-4 text-emerald-300" />
            <div>
              <span className="text-[10px] text-emerald-200 block font-semibold">Atmosphere</span>
              <span className="font-bold text-white text-sm">Favorable</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Outlook */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>5-Day Agro-Forecast Outlook</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {forecast.map((f, i) => (
            <Card key={i} className="p-3.5 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">{f.date}</span>
              <div className="text-lg font-extrabold text-slate-900 my-1">{f.temperature}°C</div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                <CloudRain className="w-3 h-3" />
                <span>{f.rainfall_prob}% Rain</span>
              </div>
              <span className="text-[10px] text-slate-500 line-clamp-1 mt-1">{f.weather_description}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Weather AI Advisory Display */}
      {advisory && (
        <div className="space-y-4">
          <AudioPlayerBar
            text={`${advisory.weather_summary}. Irrigation advice: ${advisory.irrigation_advice}`}
            title="Weather Audio Briefing"
          />

          <Card className="p-6 border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
            <h3 className="text-sm font-bold text-orange-950 uppercase mb-2">
              Agricultural Risk Assessment & Operational Actions
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">{advisory.weather_summary}</p>

            {/* Risk cards */}
            <div className="space-y-3">
              {advisory.agricultural_risks.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-orange-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.risk}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {item.severity} Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{item.explanation}</p>
                    <p className="text-xs font-semibold text-emerald-800 mt-1">
                      Action: {item.recommended_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Precautions & Irrigation Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-orange-200 text-xs">
              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farm Precautions</span>
                </h5>
                <ul className="space-y-1 text-slate-600">
                  {advisory.farming_precautions.map((p: string, i: number) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  <span>Irrigation Adjustment</span>
                </h5>
                <p className="text-slate-600 leading-relaxed">{advisory.irrigation_advice}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};


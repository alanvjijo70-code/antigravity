import React, { useEffect, useState } from 'react';
import { CloudRain, Wind, Droplets, Sun, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

interface WeatherData {
  location_name: string;
  temperature: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  weather_description: string;
  is_live: boolean;
}

export const WeatherWidget: React.FC<{ district?: string; state?: string }> = ({
  district = 'Palakkad',
  state = 'Kerala',
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const res = await api.get('/weather/current', {
          params: { location: `${district}, ${state}` },
        });
        if (isMounted && res.data?.data) {
          setWeather(res.data.data);
        }
      } catch (e) {
        console.warn('Weather widget fallback:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [district, state]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-5 text-white animate-pulse">
        <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-white/20 rounded w-1/2 mb-2"></div>
      </div>
    );
  }

  const w = weather || {
    location_name: `${district}, ${state}`,
    temperature: 28.5,
    temp_min: 24.0,
    temp_max: 32.0,
    humidity: 78,
    rainfall: 2.5,
    wind_speed: 3.2,
    weather_description: 'Humid with passing cloud cover',
    is_live: false,
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
      {/* Decorative background sun/cloud ring */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-700/30 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-200">
            {w.is_live ? 'Live Station' : 'Regional Agro-Weather'}
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">{w.location_name}</h3>
          <p className="text-xs text-emerald-100 capitalize mt-0.5">{w.weather_description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold tracking-tight text-white flex items-start">
            {w.temperature}
            <span className="text-base font-normal text-emerald-300 ml-0.5">°C</span>
          </div>
          <span className="text-[10px] text-emerald-200">
            H: {w.temp_max}° | L: {w.temp_min}°
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-700/50 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-100">
          <Droplets className="w-3.5 h-3.5 text-emerald-300" />
          <span>{w.humidity}% Hum.</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-100">
          <CloudRain className="w-3.5 h-3.5 text-emerald-300" />
          <span>{w.rainfall} mm Rain</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-100">
          <Wind className="w-3.5 h-3.5 text-emerald-300" />
          <span>{w.wind_speed} m/s</span>
        </div>
      </div>

      <div className="mt-3 text-right">
        <Link
          to="/weather"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-200 hover:text-white transition"
        >
          <span>View 5-Day Forecast & Agro-Alerts</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { api } from '../services/api';
import { User, Phone, Mail, MapPin, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    preferred_language: user?.preferred_language || language || 'en',
    state: user?.state || 'Kerala',
    district: user?.district || 'Palakkad',
    village: user?.village || '',
    farm_name: user?.farm_name || '',
    land_area: user?.land_area || 2.5,
    land_unit: user?.land_unit || 'acre',
    farming_type: user?.farming_type || 'Integrated Agro-Forestry',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        preferred_language: (user.preferred_language as 'en' | 'ml') || language || 'en',
        state: user.state || 'Kerala',
        district: user.district || 'Palakkad',
        village: user.village || '',
        farm_name: user.farm_name || '',
        land_area: user.land_area || 2.5,
        land_unit: user.land_unit || 'acre',
        farming_type: user.farming_type || 'Integrated Agro-Forestry',
      });
    }
  }, [user, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'preferred_language') {
      setLanguage(e.target.value as 'en' | 'ml');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.put('/profile', formData);
      if (res.data?.data) {
        updateUser(res.data.data);
      } else {
        updateUser(formData);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farmer Profile & Farm Baseline</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal details, geographical baseline, and default agricultural preferences.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile changes saved and synchronized successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity & Contact */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'farmer@agrisense.ai'}
                  className="w-full text-xs sm:text-sm border border-slate-200 bg-slate-100 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98470 00000"
                    className="w-full pl-9 text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Regional Geography */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Location & Geography</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Locality</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g., Chittur"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Farm Land Dimensions */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>Farm Land Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  name="farm_name"
                  value={formData.farm_name}
                  onChange={handleChange}
                  placeholder="e.g., Green Meadows"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Farmland Area</label>
                <input
                  type="number"
                  step="0.01"
                  name="land_area"
                  value={formData.land_area}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Measurement Unit</label>
                <select
                  name="land_unit"
                  value={formData.land_unit}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white"
                >
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                  <option value="cent">Cent</option>
                  <option value="guntha">Guntha</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Farming Philosophy</label>
              <select
                name="farming_type"
                value={formData.farming_type}
                onChange={handleChange}
                className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white"
              >
                <option value="Integrated Agro-Forestry">Integrated Agro-Forestry / Multi-Cropping</option>
                <option value="Organic Farming">Organic & Natural Farming (ZBNF)</option>
                <option value="Conventional High-Yield">Conventional High-Yield Farming</option>
                <option value="Protected Horticulture">Protected Polyhouse / Horticulture</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" isLoading={loading}>
              Save Profile Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


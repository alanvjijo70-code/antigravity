import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { api } from '../services/api';
import { MapPin, Plus, Trash2, Droplets, Layers, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface FarmPlot {
  id: string;
  farm_name: string;
  state: string;
  district: string;
  village?: string;
  land_area: number;
  land_unit: string;
  soil_type: string;
  soil_ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  water_source: string;
  farming_method?: string;
  created_at?: string;
}

export const FarmPlotsPage: React.FC = () => {
  const [farms, setFarms] = useState<FarmPlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farm_name: '',
    state: 'Kerala',
    district: 'Palakkad',
    village: '',
    land_area: 2.5,
    land_unit: 'acre',
    soil_type: 'Laterite',
    soil_ph: 6.5,
    nitrogen: 210,
    phosphorus: 25,
    potassium: 180,
    water_source: 'Open Well & Canal Basin',
    farming_method: 'Integrated Multi-Cropping',
  });

  const fetchFarms = async () => {
    try {
      const res = await api.get('/farms');
      if (res.data?.data) {
        setFarms(res.data.data);
      }
    } catch (e: any) {
      console.warn('Farms fetch note:', e);
      // Fallback sample plot if offline
      setFarms([
        {
          id: 'plot-default-1',
          farm_name: 'Paddy & Coconut Riverbed Plot',
          state: 'Kerala',
          district: 'Palakkad',
          village: 'Chittur',
          land_area: 3.5,
          land_unit: 'acre',
          soil_type: 'Alluvial Loam',
          soil_ph: 6.8,
          nitrogen: 240,
          phosphorus: 32,
          potassium: 195,
          water_source: 'Canal Basin & Submersible Borewell',
          farming_method: 'Integrated Agro-Forestry',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/farms', {
        ...formData,
        land_area: Number(formData.land_area),
        soil_ph: formData.soil_ph ? Number(formData.soil_ph) : null,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
      });

      if (res.data?.data) {
        setFarms((prev) => [res.data.data, ...prev]);
      } else {
        setFarms((prev) => [{ id: 'temp-' + Date.now(), ...formData } as any, ...prev]);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create farm plot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this farm plot?')) return;
    try {
      await api.delete(`/farms/${id}`);
      setFarms((prev) => prev.filter((f) => f.id !== id));
    } catch (e: any) {
      setFarms((prev) => prev.filter((f) => f.id !== id));
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your registered farm parcels..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Farm Plots & Fields</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register individual parcels with soil metrics to auto-populate crop, fertilizer, and irrigation advisors.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Add New Plot
        </Button>
      </div>

      {farms.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-8 h-8 text-emerald-600" />}
          title="No farm parcels registered yet"
          description="Register your first plot with soil properties and water source to unlock automatic recommendations."
          actionText="Register Plot Now"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <Card key={farm.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{farm.farm_name}</h3>
                      <p className="text-[11px] text-slate-500">
                        {farm.district}, {farm.state} {farm.village ? `(${farm.village})` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(farm.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                    title="Delete plot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Dimensions</span>
                    <span className="font-bold text-slate-800">{farm.land_area} {farm.land_unit}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Soil Type</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{farm.soil_type}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="line-clamp-1">Water: {farm.water_source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>pH: {farm.soil_ph ?? 'N/A'} • NPK: {farm.nitrogen ?? '?'}-{farm.phosphorus ?? '?'}-{farm.potassium ?? '?'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Farm Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Farm Plot</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plot / Field Name *</label>
                <input
                  type="text"
                  name="farm_name"
                  required
                  value={formData.farm_name}
                  onChange={handleChange}
                  placeholder="e.g., North Riverbank Plot"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Land Area *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="land_area"
                    required
                    value={formData.land_area}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    name="land_unit"
                    value={formData.land_unit}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                    <option value="cent">Cent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type *</label>
                  <select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Laterite">Laterite Soil</option>
                    <option value="Alluvial">Alluvial Soil</option>
                    <option value="Red & Yellow">Red & Yellow Soil</option>
                    <option value="Black Cotton">Black Cotton Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Soil pH</label>
                  <input
                    type="number"
                    step="0.1"
                    name="soil_ph"
                    value={formData.soil_ph}
                    onChange={handleChange}
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Water Source *</label>
                <select
                  name="water_source"
                  value={formData.water_source}
                  onChange={handleChange}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Borewell with Drip">Borewell with Drip Irrigation</option>
                  <option value="Canal Basin">Canal Irrigation Basin</option>
                  <option value="Open Well & Sprinkler">Open Well & Overhead Sprinkler</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed (Strictly Monsoon Dependent)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                  Save Plot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


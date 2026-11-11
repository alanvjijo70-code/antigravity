import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ImageUploader } from '../components/disease/ImageUploader';
import { DiagnosisResultCard, DiagnosisData } from '../components/disease/DiagnosisResultCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { Stethoscope, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropName, setCropName] = useState('Tomato');
  const [plantPart, setPlantPart] = useState<'Leaves' | 'Stem/Shoot' | 'Fruit/Earhead' | 'Root' | 'Whole Plant'>('Leaves');
  const [symptoms, setSymptoms] = useState('');
  const [dateObserved, setDateObserved] = useState('');

  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or capture a photograph of the infected foliage.');
      return;
    }

    setLoading(true);
    setError(null);
    setDiagnosis(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('crop_name', cropName);
    formData.append('plant_part_affected', plantPart);
    formData.append('symptom_duration_days', '3');
    if (symptoms) formData.append('symptoms', symptoms);
    if (dateObserved) formData.append('date_observed', dateObserved);
    formData.append('language', language);

    try {
      const res = await api.post('/disease/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 25000,
      });

      if (res.data?.data) {
        setDiagnosis(res.data.data);
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to complete diagnosis. Ensure the image is clear and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Multimodal Plant Pathology Vision Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('disease.title')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('disease.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Symptoms Form */}
        <div className="lg:col-span-5">
          <Card className="p-6">
            <form onSubmit={handleDiagnose} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Plant Foliage / Stem Photograph *
                </label>
                <ImageUploader
                  selectedFile={selectedFile}
                  onImageSelected={(file) => {
                    setSelectedFile(file);
                    setError(null);
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crop Species *
                </label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Tomato, Coconut, Banana, Paddy, Pepper"
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plant Part Affected *
                </label>
                <select
                  value={plantPart}
                  onChange={(e) => setPlantPart(e.target.value as any)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Leaves">Leaves / Foliage</option>
                  <option value="Stem/Shoot">Stem / Central Shoot</option>
                  <option value="Fruit/Earhead">Fruit / Pod / Earhead</option>
                  <option value="Root">Root & Collar Zone</option>
                  <option value="Whole Plant">Whole Plant Wilting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Symptoms Observed (Optional)
                </label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t('disease.symptomsPlaceholder')}
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={loading}
                disabled={!selectedFile}
              >
                {loading ? t('disease.diagnosing') : t('disease.diagnose')}
              </Button>
            </form>
          </Card>
        </div>

        {/* Diagnosis Results */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
              <LoadingSpinner message="Scanning plant morphology, spots & lesions with Gemini Vision..." />
            </div>
          )}

          {!loading && !diagnosis && !error && (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Image Uploaded Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Capture or upload an infected leaf photo on the left. The AI pathologist will identify the pathogen and return an IPM treatment protocol.
              </p>
            </div>
          )}

          {!loading && diagnosis && (
            <DiagnosisResultCard data={diagnosis} cropName={cropName} />
          )}
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Card } from '../common/Card';
import { SeverityBadge } from './SeverityBadge';
import { AudioPlayerBar } from '../common/AudioPlayerBar';
import { AlertTriangle, ShieldCheck, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface DiagnosisData {
  image_quality: string;
  is_plant_image: boolean;
  observed_symptoms: string[];
  possible_conditions: Array<{
    name: string;
    category: string;
    confidence: number;
    reason: string;
  }>;
  immediate_actions: string[];
  preventive_measures: string[];
  expert_consultation_required: boolean;
  additional_information_needed: string[];
  disclaimer: string;
  image_url?: string;
}

export const DiagnosisResultCard: React.FC<{
  data: DiagnosisData;
  cropName: string;
}> = ({ data, cropName }) => {
  const { t } = useLanguage();
  const primaryCondition = data.possible_conditions[0];

  // Speech summary text
  const speechText = primaryCondition
    ? `Diagnosis for ${cropName}: Most likely condition is ${primaryCondition.name}, category ${primaryCondition.category}, with ${primaryCondition.confidence} percent confidence. Recommended immediate actions: ${data.immediate_actions.slice(0, 3).join('. ')}`
    : `Plant health check complete. ${data.disclaimer}`;

  return (
    <div className="space-y-4">
      {/* Audio Vocalization Bar */}
      <AudioPlayerBar text={speechText} title={`Voice Diagnostic: ${cropName}`} />

      <Card className="p-6 border-emerald-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              {cropName} Pathology Report
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {primaryCondition?.name || 'Plant Health Inspection'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Category: <span className="font-semibold text-slate-700">{primaryCondition?.category || 'General'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {primaryCondition && (
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Model Confidence</span>
                <p className="text-sm font-extrabold text-emerald-700">{primaryCondition.confidence}%</p>
              </div>
            )}
            <SeverityBadge severity={primaryCondition ? 'moderate' : 'low'} />
          </div>
        </div>

        {/* Symptoms Observed */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Visual Symptoms Observed by Vision AI
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.observed_symptoms.map((sym, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-medium"
              >
                {sym}
              </span>
            ))}
          </div>
        </div>

        {/* Diagnostic Reasoning */}
        {primaryCondition && (
          <div className="mt-4 p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 leading-relaxed">
            <span className="font-bold">Agronomic Rationale: </span>
            {primaryCondition.reason}
          </div>
        )}

        {/* Immediate IPM Actions */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Immediate Remediation Actions (IPM)</span>
          </h4>
          <div className="space-y-2">
            {data.immediate_actions.map((act, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="leading-relaxed">{act}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Cultural Practices */}
        {data.preventive_measures && data.preventive_measures.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Preventive Measures for Next Growth Cycle</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {data.preventive_measures.map((prev, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl leading-relaxed flex items-start gap-2"
                >
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expert Inspection Alert */}
        {data.expert_consultation_required && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <h5 className="font-bold">On-Site Expert Inspection Recommended</h5>
              <p className="mt-0.5 leading-relaxed">
                Symptoms indicate potential high-spread pathology. Please verify with your local Agricultural Extension Officer (Krishi Bhavan) before applying high-potency chemical sprays.
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-400 italic">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{data.disclaimer}</span>
        </div>
      </Card>
    </div>
  );
};

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const SuggestedQuestions: React.FC<{
  onSelect: (q: string) => void;
}> = ({ onSelect }) => {
  const { language } = useLanguage();

  const questions = language === 'ml' ? [
    'വാഴയിൽ ഇലപ്പുള്ളി രോഗം തടയാൻ എന്തു ചെയ്യണം?',
    'തെങ്ങിന്റെ ഉൽപ്പാദനം കൂട്ടാൻ ജൈവവളങ്ങൾ ഏതൊക്കെ?',
    'മഴക്കാലത്ത് പച്ചക്കറി കൃഷിയിൽ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ?',
    'നെല്ലിന് മഞ്ഞളിപ്പ് വന്നാൽ എന്ത് വളമാണ് നൽകേണ്ടത്?',
  ] : [
    'How do I treat leaf curl virus in chili plants?',
    'What is the ideal N-P-K fertilizer schedule for coconut palms?',
    'How much water does upland paddy require per week?',
    'What organic sprays control aphids and whiteflies effectively?',
  ];

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Suggested Agricultural Questions</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(q)}
            className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 text-left transition shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

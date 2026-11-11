import React from 'react';
import { ChatWindow } from '../components/chatbot/ChatWindow';
import { Sparkles, BotMessageSquare } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AssistantPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multilingual Conversational Agronomist</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Agricultural Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'ml'
            ? 'നിങ്ങളുടെ കൃഷി സംശയങ്ങൾ മലയാളത്തിൽ ചോദിക്കൂ. തൽക്ഷണ ശാസ്ത്രീയ നിർദ്ദേശങ്ങൾ ലഭിക്കും.'
            : 'Ask questions about pest outbreaks, organic manure, crop rotation, and water scheduling with step-by-step guidance.'}
        </p>
      </div>

      <ChatWindow />
    </div>
  );
};


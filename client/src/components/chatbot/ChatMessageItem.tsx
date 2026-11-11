import React from 'react';
import { Bot, User, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { AudioPlayerBar } from '../common/AudioPlayerBar';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  important_points?: string[];
  recommended_actions?: string[];
  warnings?: string[];
  follow_up_question?: string | null;
  created_at?: string;
}

export const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
          isUser
            ? 'bg-emerald-700 text-white rounded-br-none shadow-sm'
            : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-xs'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Structured AI response additions */}
        {!isUser && (
          <div className="mt-3 space-y-3">
            {/* Audio Vocalizer for assistant answer */}
            <AudioPlayerBar text={message.content} title="Audio Answer" className="mt-2" />

            {/* Recommended Actions */}
            {message.recommended_actions && message.recommended_actions.length > 0 && (
              <div className="bg-emerald-50/80 border border-emerald-200/70 p-3 rounded-xl">
                <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                  Action Steps:
                </span>
                <ul className="space-y-1 text-xs text-emerald-900">
                  {message.recommended_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {message.warnings && message.warnings.length > 0 && (
              <div className="bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Precautions:
                </span>
                <ul className="text-xs text-amber-900 space-y-0.5">
                  {message.warnings.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up question */}
            {message.follow_up_question && (
              <div className="text-[11px] text-slate-500 italic flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span>Next question: {message.follow_up_question}</span>
              </div>
            )}
          </div>
        )}

        <div
          className={`text-[10px] mt-2 flex ${
            isUser ? 'justify-end text-emerald-200' : 'justify-end text-slate-400'
          }`}
        >
          {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

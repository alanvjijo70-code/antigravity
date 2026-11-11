import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, PlusCircle } from 'lucide-react';
import { ChatMessageItem, ChatMessage } from './ChatMessageItem';
import { SuggestedQuestions } from './SuggestedQuestions';
import { api } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';

export const ChatWindow: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: language === 'ml'
        ? 'നമസ്കാരം! ഞാൻ അഗ്രിസെൻസ് AI കൃഷി സഹായിയാണ്. വിള തിരഞ്ഞെടുക്കൽ, വളപ്രയോഗം, സസ്യരോഗങ്ങൾ, കീടനിയന്ത്രണം എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം.'
        : 'Hello! I am AgriSense AI, your digital agricultural assistant. Ask me anything about crop planning, plant diseases, soil fertility, or pest control.',
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (contentToSend?: string) => {
    const text = (contentToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', {
        conversation_id: conversationId,
        content: text,
        language,
      });

      if (res.data?.data) {
        const d = res.data.data;
        if (d.conversation_id) setConversationId(d.conversation_id);

        const aiMsg: ChatMessage = {
          role: 'assistant',
          content: d.content,
          important_points: d.important_points,
          recommended_actions: d.recommended_actions,
          warnings: d.warnings,
          follow_up_question: d.follow_up_question,
          created_at: d.created_at || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please check your network or try again.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content: language === 'ml'
          ? 'പുതിയ സംഭാഷണം ആരംഭിച്ചു. നിങ്ങളുടെ സംശയം ചോദിക്കൂ.'
          : 'Started a fresh conversation. What agricultural topic would you like to discuss?',
        created_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Dr. Ceres (AgriSense Assistant)</h3>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Ready (Gemini Powered)
            </span>
          </div>
        </div>

        <button
          onClick={startNewConversation}
          className="text-xs font-semibold text-slate-600 hover:text-emerald-800 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition shadow-2xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Message stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessageItem key={index} message={msg} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-fit">
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Consulting agronomic knowledge base & formulating advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 border-t border-slate-100">
        <SuggestedQuestions onSelect={(q) => handleSend(q)} />
      </div>

      {/* Input area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'ml' ? 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ നൽകുക...' : 'Ask about crops, diseases, fertilizers, or water management...'}
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Square } from 'lucide-react';
import { SpeechUtil } from '../../utils/speech';
import { useLanguage } from '../../i18n/LanguageContext';

interface AudioPlayerBarProps {
  text: string;
  title?: string;
  className?: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  text,
  title = 'Voice Advisory',
  className = '',
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(SpeechUtil.isSupported());
    return () => {
      SpeechUtil.stop();
    };
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      SpeechUtil.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);
    SpeechUtil.speak(
      text,
      language,
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      }
    );
  };

  const handlePause = () => {
    SpeechUtil.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    SpeechUtil.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!supported || !text) return null;

  return (
    <div
      className={`flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </div>
        <div>
          <h4 className="text-xs font-semibold text-emerald-950">{title}</h4>
          <p className="text-[11px] text-emerald-700">
            {language === 'ml' ? 'ശബ്ദരൂപത്തിലുള്ള കൃഷി നിർദ്ദേശം' : 'Spoken Vernacular Audio Script'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="p-1.5 text-emerald-800 hover:bg-emerald-200/60 rounded-lg transition"
            title="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="px-2.5 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-medium rounded-lg flex items-center gap-1 transition shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPaused ? 'Resume' : 'Listen'}</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="p-1.5 text-slate-500 hover:bg-slate-200/60 rounded-lg transition"
            title="Stop"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

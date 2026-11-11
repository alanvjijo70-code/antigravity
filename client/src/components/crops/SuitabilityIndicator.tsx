import React from 'react';

export const SuitabilityIndicator: React.FC<{ score: number; size?: 'sm' | 'md' | 'lg' }> = ({
  score,
  size = 'md',
}) => {
  const getColor = (s: number) => {
    if (s >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-600', border: 'border-emerald-300' };
    if (s >= 60) return { bg: 'bg-teal-100', text: 'text-teal-800', bar: 'bg-teal-600', border: 'border-teal-300' };
    if (s >= 40) return { bg: 'bg-amber-100', text: 'text-amber-800', bar: 'bg-amber-600', border: 'border-amber-300' };
    return { bg: 'bg-red-100', text: 'text-red-800', bar: 'bg-red-600', border: 'border-red-300' };
  };

  const col = getColor(score);

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${col.bg} ${col.text}`}>
        {score}% Match
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${col.bar} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className={`text-xs font-bold ${col.text}`}>{score}%</span>
    </div>
  );
};

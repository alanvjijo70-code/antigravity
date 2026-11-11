import React from 'react';

export const SeverityBadge: React.FC<{ severity: string; className?: string }> = ({
  severity,
  className = '',
}) => {
  const s = (severity || 'moderate').toLowerCase();

  if (s.includes('critical') || s.includes('severe') || s.includes('high')) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        High Risk / Critical
      </span>
    );
  }

  if (s.includes('moderate') || s.includes('medium')) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
        Moderate
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
      Low / Manageable
    </span>
  );
};

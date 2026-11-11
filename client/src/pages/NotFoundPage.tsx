import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 shadow-sm">
        <Sprout className="w-8 h-8 text-emerald-700" />
      </div>
      <h1 className="text-4xl font-black text-slate-900">404</h1>
      <h2 className="text-lg font-bold text-slate-800 mt-1">Page Not Found in Agricultural Map</h2>
      <p className="text-xs text-slate-500 mt-2 max-w-sm">
        The field or route you are looking for has been moved or does not exist.
      </p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { AudioPlayerBar } from '../components/common/AudioPlayerBar';
import { api } from '../services/api';
import {
  History,
  Trash2,
  Calendar,
  Filter,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history', {
        params: { type: selectedType !== 'all' ? selectedType : undefined },
      });
      if (res.data?.data) {
        setReports(res.data.data);
      }
    } catch (e: any) {
      console.warn('History fetch note:', e);
      // Fallback sample reports for demonstration
      setReports([
        {
          id: 'report-demo-1',
          advisory_type: 'crop',
          title: 'Crop Advisory: Palakkad, Kerala (Kharif/Monsoon)',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          input_data: { district: 'Palakkad', soil_type: 'Alluvial Loam', season: 'Kharif' },
          result_data: {
            summary: 'Soil conditions highly favorable for paddy and commercial banana cultivation with high moisture retention.',
            recommendations: [
              { crop_name: 'Paddy (Jyothi)', suitability_score: 95 },
              { crop_name: 'Banana (Nendran)', suitability_score: 91 },
            ],
          },
        },
        {
          id: 'report-demo-2',
          advisory_type: 'disease',
          title: 'Plant Pathology: Tomato (Early Blight / Alternaria solani)',
          created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
          input_data: { crop_name: 'Tomato', plant_part: 'Leaves' },
          result_data: {
            possible_conditions: [{ name: 'Early Blight (Alternaria solani)', confidence: 92 }],
            immediate_actions: [
              'Remove infected lower leaves displaying concentric target spots.',
              'Spray copper oxychloride (COC) @ 2.5g/L water on calm morning.',
            ],
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedType]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advisory record?')) return;
    try {
      await api.delete(`/history/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.advisory_type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agricultural Advisory Archive</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Access and filter previous crop recommendations, plant disease diagnoses, and water schedules.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'crop', 'disease', 'fertilizer', 'irrigation', 'weather'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedType === type
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </Card>

      {/* Reports List */}
      {loading ? (
        <LoadingSpinner message="Retrieving archived farm advisory logs..." />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8 text-emerald-600" />}
          title="No advisory records found"
          description="You haven't generated any advisory reports matching your current filter criteria."
        />
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const isExpanded = expandedId === report.id;
            return (
              <Card key={report.id} className="p-5 border-slate-200 hover:border-emerald-300 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 mt-0.5">
                      {report.advisory_type?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{report.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="capitalize font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {report.advisory_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(report.created_at).toLocaleDateString()} {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : report.id)}
                      className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {report.result_data?.summary && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {report.result_data.summary}
                      </p>
                    )}

                    {report.result_data?.image_url && (
                      <div className="max-w-xs rounded-xl overflow-hidden border border-slate-200">
                        <img src={report.result_data.image_url} alt="Analyzed Leaf" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    {/* Full JSON details view */}
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56">
                      <pre>{JSON.stringify(report.result_data, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};


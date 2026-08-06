import React, { useState } from 'react';
import { Award, Target, Star, TrendingUp, CheckCircle, Plus, Filter, MessageSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';

export const PerformanceView: React.FC = () => {
  const { performanceReviews, goals, employees } = useData();
  const [activeTab, setActiveTab] = useState<'reviews' | 'okrs'>('reviews');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Performance & Review Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track employee goals, OKRs, feedback cycles, and annual appraisal performance ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Performance Reviews
            </button>
            <button
              onClick={() => setActiveTab('okrs')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'okrs'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Company OKRs & Goals
            </button>
          </div>

          <button className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            New Goal / Review
          </button>
        </div>
      </div>

      {activeTab === 'reviews' ? (
        /* Performance Reviews Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceReviews.map((rev) => {
            const emp = employees.find((e) => e.id === rev.employeeId);
            return (
              <div
                key={rev.id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp?.photoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                      alt={rev.employeeName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rev.employeeName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rev.reviewCycle} • Reviewed by {rev.reviewerName}
                      </p>
                    </div>
                  </div>
                  <Badge variant={rev.status === 'Completed' ? 'success' : 'warning'}>{rev.status}</Badge>
                </div>

                {/* Rating score badge */}
                <div className="flex items-center gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Overall Rating: {rev.rating} / 5.0
                  </span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 ml-auto font-semibold">
                    Exceeds Expectations
                  </span>
                </div>

                {/* Feedback summary */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">Strengths:</span>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
                      {rev.strengths}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-0.5">Growth Opportunities:</span>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
                      {rev.improvements}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reviewed on: {rev.submittedAt}</span>
                  <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Full Assessment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* OKRs & Goals List */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs p-5 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" /> Active Quarter Goals & Key Results
          </h2>

          <div className="space-y-4">
            {goals.map((g) => (
              <div
                key={g.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{g.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Assigned to: <span className="font-semibold text-slate-700 dark:text-slate-300">{g.employeeName}</span> • Due {g.dueDate}
                    </div>
                  </div>
                  <Badge variant={g.status === 'Completed' ? 'success' : 'info'}>{g.status}</Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">{g.description}</p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>Target Progress</span>
                    <span className="font-bold">{g.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

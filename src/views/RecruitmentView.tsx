import React, { useState } from 'react';
import { Briefcase, UserPlus, MapPin, DollarSign, Plus, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';

export const RecruitmentView: React.FC = () => {
  const { jobs, applicants } = useData();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const jobApplicants = applicants.filter((a) => a.jobId === activeJob?.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Recruitment & Applicant Tracking (ATS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage open requisitions, candidate interview pipelines, and talent acquisition.
          </p>
        </div>

        <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Post New Job Requisition
        </button>
      </div>

      {/* Main Grid: Jobs List vs Candidates Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs Requisitions List */}
        <div className="space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider text-slate-500">
            Open Requisitions ({jobs.length})
          </h2>

          {jobs.map((job) => {
            const isSelected = job.id === activeJob?.id;
            const count = applicants.filter((a) => a.jobId === job.id).length;

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{job.title}</h3>
                  <Badge variant={job.status === 'Open' ? 'success' : 'neutral'}>{job.status}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <DollarSign className="w-3 h-3 text-slate-400" /> {job.salaryRange}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{job.department}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {count} Candidates
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Job Candidates Pipeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          {activeJob && (
            <>
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Candidates for: {activeJob.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeJob.department} • {activeJob.type} • {activeJob.location}
                  </p>
                </div>

                <div className="text-xs font-semibold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  {jobApplicants.length} Total Applicants
                </div>
              </div>

              {/* Candidates List */}
              <div className="space-y-3">
                {jobApplicants.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No active applicants for this position yet
                  </div>
                ) : (
                  jobApplicants.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {app.candidateName}
                          </span>
                          <Badge
                            variant={
                              app.stage === 'Hired'
                                ? 'success'
                                : app.stage === 'Offered'
                                ? 'purple'
                                : app.stage === 'Interview'
                                ? 'info'
                                : 'neutral'
                            }
                          >
                            {app.stage}
                          </Badge>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-1">
                          {app.email} • {app.phone} • Applied on {app.appliedDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> View Resume
                        </button>
                        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors">
                          Advance Stage
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

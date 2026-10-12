import { FileText, Plus, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { TEMPLATES } from '../engine/templateConfig';

const Dashboard = ({ onCreateNew }) => {
  const { resumes, dispatch, resumeData } = useResume();

  const savedResumes = resumes.length > 0 ? resumes : (
    resumeData ? [{ id: 'current', name: resumeData.personalInfo?.fullName || 'My Resume', updatedAt: new Date().toISOString(), template: 'classic' }] : []
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      {/* Hero */}
      <div className="relative mb-14">
        {/* Subtle radial glow background in dark mode */}
        <div className="absolute -top-12 -left-12 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 mb-4">
          <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
          AI-Powered Smart Resume Builder
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Build a resume recruiters <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">actually read</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Create ATS-optimized, professionally formatted resumes with conversational guidance.
          Export print-ready PDFs and portfolios in minutes.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onCreateNew}
            className="btn-primary !px-7 !py-3.5 !text-base shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
            Create New Resume
          </button>
        </div>
      </div>

      {/* Resume Cards */}
      {savedResumes.length > 0 ? (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Resumes</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {savedResumes.length} {savedResumes.length === 1 ? 'resume' : 'resumes'} saved
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedResumes.map((r) => (
              <button
                key={r.id}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'editor' })}
                className="text-left bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center">
                    <FileText size={22} className="text-blue-700 dark:text-blue-400" />
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {r.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                    {r.template || 'classic'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="mb-14 bg-white/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No resumes yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Answer a few quick questions with our interactive builder to generate your ATS-ready resume.
          </p>
          <button onClick={onCreateNew} className="btn-primary">
            <Plus size={16} /> Get Started Now
          </button>
        </div>
      )}

      {/* Template Previews */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Professional Templates</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">6 ATS-compliant styles</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-md transition-all group"
            >
              <div
                className="h-24 p-3 flex flex-col justify-end"
                style={{
                  background: `linear-gradient(180deg, ${t.accent}22 0%, rgba(15, 23, 42, 0.05) 100%)`
                }}
              >
                <div className="h-1.5 rounded" style={{ background: t.accent, width: '65%' }} />
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded mt-1.5 w-full" />
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded mt-1 w-4/5" />
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {t.description || 'Clean & Professional'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center mb-6">
          How It Works
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Interactive Chat', desc: 'Answer quick questions at your own pace' },
            { step: '2', title: 'AI Structuring', desc: 'Automated formatting with bullet points' },
            { step: '3', title: 'ATS Score & Match', desc: 'Keyword analysis against real job descriptions' },
            { step: '4', title: 'Instant Export', desc: 'Download PDF or deploy web portfolio' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-sm">
                {item.step}
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

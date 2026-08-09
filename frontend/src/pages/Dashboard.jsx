import { FileText, Plus, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { TEMPLATES } from '../engine/templateConfig';

const Dashboard = ({ onCreateNew }) => {
  const { resumes, dispatch, resumeData } = useResume();

  const savedResumes = resumes.length > 0 ? resumes : (
    resumeData ? [{ id: 'current', name: resumeData.personalInfo?.fullName || 'My Resume', updatedAt: new Date().toISOString(), template: 'classic' }] : []
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Build a resume recruiters actually read
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mb-8">
          Create ATS-optimized, professionally formatted resumes with AI assistance.
          Export print-ready PDFs in minutes.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create New Resume
        </button>
      </div>

      {/* Resume Cards */}
      {savedResumes.length > 0 ? (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Resumes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResumes.map((r) => (
              <button
                key={r.id}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'editor' })}
                className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText size={20} className="text-blue-700" />
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-700 transition-colors mt-1" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{r.name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(r.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="mb-12 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
          <FileText size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No resumes yet</h3>
          <p className="text-slate-500 mb-6">Start building your professional resume in under 10 minutes.</p>
          <button onClick={onCreateNew} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Get Started
          </button>
        </div>
      )}

      {/* Template Previews */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-blue-700" />
          <h2 className="text-lg font-semibold text-slate-900">Professional Templates</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-24 p-3 flex flex-col justify-end" style={{ background: `linear-gradient(180deg, ${t.accent}15 0%, white 100%)` }}>
                <div className="h-1.5 rounded" style={{ background: t.accent, width: '60%' }} />
                <div className="h-1 bg-slate-200 rounded mt-1.5 w-full" />
                <div className="h-1 bg-slate-200 rounded mt-1 w-4/5" />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-semibold text-slate-800 truncate">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Choose Template', 'Enter Information', 'AI Assistance', 'Download PDF'].map((step, i) => (
          <div key={step} className="text-center p-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center mx-auto mb-2">
              {i + 1}
            </div>
            <p className="text-sm font-medium text-slate-700">{step}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;

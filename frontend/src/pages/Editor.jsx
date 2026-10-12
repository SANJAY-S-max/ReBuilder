import { useState, useRef } from 'react';
import { ArrowLeft, Palette, BarChart3, Target, MessageSquare, Globe } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import ResumePreviewPanel from '../components/ResumePreviewPanel';
import CustomizationPanel from '../components/CustomizationPanel';
import ATSPanel from '../components/ATSPanel';
import JobMatchTab from '../components/tabs/JobMatchTab';
import InterviewTab from '../components/tabs/InterviewTab';
import PortfolioTab from '../components/tabs/PortfolioTab';

const SIDEBAR_TABS = [
  { id: 'customize', label: 'Customize', icon: Palette },
  { id: 'ats', label: 'ATS Analysis', icon: BarChart3 },
  { id: 'jobmatch', label: 'Job Match', icon: Target },
  { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
  { id: 'portfolio', label: 'Portfolio', icon: Globe },
];

const Editor = ({ onBack }) => {
  const { resumeData, customization, atsScore } = useResume();
  const [activeTab, setActiveTab] = useState('customize');
  const previewRef = useRef(null);

  if (!resumeData) {
    return (
      <div className="max-w-lg mx-auto py-24 text-center px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-5">No resume data found in the current session.</p>
          <button onClick={onBack} className="btn-primary">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-[#0c1220] border-b border-slate-200 dark:border-slate-800/90 shadow-sm z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            {resumeData.personalInfo?.fullName || 'Untitled Resume'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {resumeData.targetRole || 'Professional Resume'}
          </p>
        </div>

        <div className="w-24 text-right">
          {atsScore && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              ATS {atsScore.score}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0d1424] flex flex-col overflow-hidden hidden md:flex shadow-sm">
          <div className="flex border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/60">
            {SIDEBAR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 bg-white dark:bg-[#0d1424] font-semibold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'customize' && <CustomizationPanel />}
            {activeTab === 'ats' && <ATSPanel atsScore={atsScore} />}
            {activeTab === 'jobmatch' && <JobMatchTab resumeData={resumeData} />}
            {activeTab === 'interview' && <InterviewTab resumeData={resumeData} />}
            {activeTab === 'portfolio' && <PortfolioTab resumeData={resumeData} />}
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-hidden p-3 sm:p-5 bg-slate-100 dark:bg-[#070a12] relative">
          {/* Subtle grid pattern in dark mode for studio feel */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none dark:block hidden" />
          <ResumePreviewPanel
            resumeData={resumeData}
            customization={customization}
            previewRef={previewRef}
          />
        </main>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] overflow-x-auto">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <tab.icon size={16} />
            {tab.label.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Editor;

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
      <div className="max-w-lg mx-auto py-20 text-center">
        <p className="text-slate-600 mb-4">No resume data available.</p>
        <button onClick={onBack} className="btn-primary">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-slate-900">{resumeData.personalInfo?.fullName || 'Resume'}</h2>
          <p className="text-xs text-slate-500">{resumeData.targetRole || 'Professional Resume'}</p>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden hidden md:flex">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {SIDEBAR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'customize' && <CustomizationPanel />}
            {activeTab === 'ats' && <ATSPanel atsScore={atsScore} />}
            {activeTab === 'jobmatch' && <JobMatchTab resumeData={resumeData} />}
            {activeTab === 'interview' && <InterviewTab resumeData={resumeData} />}
            {activeTab === 'portfolio' && <PortfolioTab resumeData={resumeData} />}
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-hidden p-4 bg-slate-100">
          <ResumePreviewPanel
            resumeData={resumeData}
            customization={customization}
            previewRef={previewRef}
          />
        </main>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-t border-slate-200 bg-white overflow-x-auto">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              activeTab === tab.id ? 'text-blue-700' : 'text-slate-500'
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

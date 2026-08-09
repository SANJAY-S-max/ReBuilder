import { useMemo, useRef, useState } from 'react';
import TabNavigation from './TabNavigation';
import ResumeTab from './tabs/ResumeTab';
import TemplatesTab from './tabs/TemplatesTab';
import JobMatchTab from './tabs/JobMatchTab';
import PortfolioTab from './tabs/PortfolioTab';
import InterviewTab from './tabs/InterviewTab';
import JsonTab from './tabs/JsonTab';
import { generateResumeHTML } from '../engine/resumeGenerator';

const TabbedResults = ({ resumeData }) => {
  const [activeTab, setActiveTab] = useState('resume');
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const previewRef = useRef(null);

  const resumeHtml = useMemo(() => {
    if (!resumeData) return '';
    return generateResumeHTML(resumeData, selectedTemplate);
  }, [resumeData, selectedTemplate]);

  return (
    <div className="w-full">
      <div className="glass-card-strong overflow-hidden">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-slate-900/30">
          {activeTab === 'resume' && (
            <ResumeTab resumeData={resumeData} resumeHtml={resumeHtml} previewRef={previewRef} />
          )}

          {activeTab === 'templates' && (
            <TemplatesTab
              resumeData={resumeData}
              onTemplateSelect={(id) => {
                setSelectedTemplate(id);
              }}
            />
          )}

          {activeTab === 'jobmatch' && <JobMatchTab resumeData={resumeData} />}

          {activeTab === 'portfolio' && <PortfolioTab resumeData={resumeData} />}

          {activeTab === 'interview' && <InterviewTab resumeData={resumeData} />}

          {activeTab === 'json' && <JsonTab resumeData={resumeData} />}
        </div>
      </div>
    </div>
  );
};

export default TabbedResults;

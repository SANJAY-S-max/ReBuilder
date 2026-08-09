import { useState, useEffect } from 'react';
import { Download, FileJson, FileText, ChevronDown, ChevronUp, Check, AlertTriangle, X, Copy, CheckCheck, Globe, Target, MessageSquare, Palette } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { generatePortfolioHTML, matchJobDescription, generateMockInterview, generateResumeHTML, generateAllResumeTemplates } from '../engine/resumeGenerator';

const ResultsPanel = ({ resumeData, resumeHtml, atsScore, previewRef }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [showAtsDetails, setShowAtsDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [currentResumeHtml, setCurrentResumeHtml] = useState(resumeHtml);
  const [allTemplates, setAllTemplates] = useState([]);

  // New Features State
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [portfolioHtml, setPortfolioHtml] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  useEffect(() => {
    if (resumeData) {
      setPortfolioHtml(generatePortfolioHTML(resumeData));
      setInterviewQuestions(generateMockInterview(resumeData));
      const templates = generateAllResumeTemplates(resumeData);
      setAllTemplates(templates.templates);
    }
  }, [resumeData]);

  useEffect(() => {
    if (resumeData) {
      const newHtml = generateResumeHTML(resumeData, selectedTemplate);
      setCurrentResumeHtml(newHtml);
    }
  }, [selectedTemplate, resumeData]);

  const handleJobMatch = () => {
    if (jdText.trim()) {
      setMatchResult(matchJobDescription(resumeData, jdText));
    }
  };

  const handleDownloadPDF = () => {
    if (!previewRef?.current) return;
    setIsDownloading(true);
    
    // Temporarily add pdf-mode class for clean white/black printing
    previewRef.current.classList.add('pdf-mode');

    const opt = {
      margin: 0,
      filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(previewRef.current).save().then(() => {
      previewRef.current.classList.remove('pdf-mode');
      setIsDownloading(false);
    });
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ScoreIcon = atsScore.score >= 90 ? Check : atsScore.score >= 70 ? AlertTriangle : X;
  const scoreColor = atsScore.score >= 90 ? 'text-emerald-400' : atsScore.score >= 70 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = atsScore.score >= 90 ? 'from-emerald-500/20 to-emerald-500/5' : atsScore.score >= 70 ? 'from-amber-500/20 to-amber-500/5' : 'from-red-500/20 to-red-500/5';
  const scoreRing = atsScore.score >= 90 ? 'stroke-emerald-400' : atsScore.score >= 70 ? 'stroke-amber-400' : 'stroke-red-400';

  const templateOptions = [
    { id: 'minimal', name: 'Minimal ATS', description: 'Clean, ATS-friendly' },
    { id: 'corporate', name: 'Corporate Blue', description: 'Professional design' },
    { id: 'two-column', name: 'Two Column', description: 'Balanced layout' },
    { id: 'sidebar-left', name: 'Sidebar Left', description: 'Modern sidebar' },
    { id: 'sidebar-right', name: 'Sidebar Right', description: 'Right sidebar' },
    { id: 'developer-dark', name: 'Developer Dark', description: 'Dark theme' },
    { id: 'elegant-serif', name: 'Elegant Serif', description: 'Classic typography' },
    { id: 'compact', name: 'Compact One Page', description: 'Space-efficient' },
    { id: 'creative', name: 'Creative Designer', description: 'Colorful design' },
    { id: 'tech', name: 'Tech-Focused', description: 'Developer style' }
  ];

  const tabs = [
    { id: 'preview', label: 'Resume', icon: FileText },
    { id: 'match', label: 'Job Match', icon: Target },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'interview', label: 'Interview', icon: MessageSquare },
    { id: 'json', label: 'JSON', icon: FileJson },
  ];

  return (
    <div className="space-y-5 fade-in">
      {/* ATS Score Card */}
      <div className={`glass-card-strong p-6 bg-gradient-to-br ${scoreBg}`}>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="stroke-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" />
              <path className={scoreRing} strokeDasharray={`${atsScore.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round" style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-xl font-bold font-mono ${scoreColor}`}>
              {atsScore.score}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              ATS Score <ScoreIcon size={18} className={scoreColor} />
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {atsScore.score >= 90 ? 'Excellent! Highly optimized.' : atsScore.score >= 70 ? 'Good — room for improvement.' : 'Needs optimization.'}
            </p>
          </div>
        </div>

        {(atsScore.suggestions.length > 0 || atsScore.missing.length > 0 || atsScore.improvements?.length > 0) && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={() => setShowAtsDetails(!showAtsDetails)}
              className="flex items-center justify-between w-full text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>View Details</span>
              {showAtsDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showAtsDetails && (
              <div className="mt-3 space-y-3 fade-in">
                {atsScore.missing.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-400 mb-2">⚠ Missing Fields</p>
                    <div className="flex flex-wrap gap-1.5">
                      {atsScore.missing.map((m, i) => <span key={i} className="chip chip-accent">{m}</span>)}
                    </div>
                  </div>
                )}
                {atsScore.improvements?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-amber-400 mb-2">🔧 Improvements</p>
                    <ul className="space-y-1.5">
                      {atsScore.improvements.map((imp, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />{imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {atsScore.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 mb-2">💡 Suggestions</p>
                    <ul className="space-y-1.5">
                      {atsScore.suggestions.map((s, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                : 'bg-white/[0.03] text-slate-400 border border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'preview' && (
        <div className="glass-card overflow-hidden fade-in">
          <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Resume Preview</span>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {isDownloading ? 'Generating...' : <><Download size={14} /> Download PDF</>}
            </button>
          </div>
          
          {/* Template Selector */}
          <div className="px-6 py-6 border-b border-white/5 bg-gradient-to-r from-slate-800/20 to-slate-900/20">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={18} className="text-indigo-400" />
              <span className="text-base font-bold text-white uppercase tracking-wider">Choose Template</span>
            </div>
            <div className="w-[75%] max-w-4xl mx-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {templateOptions.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-2 rounded-md text-xs font-medium transition-all duration-200 border ${
                      selectedTemplate === template.id
                        ? 'bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-pink-500/20 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400/50'
                        : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700/70 hover:border-indigo-600 hover:text-white backdrop-blur-sm'
                    }`}
                    title={template.description}
                  >
                    <div className="text-center">
                      <div className="font-semibold mb-1 text-xs leading-tight">{template.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal leading-tight">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-x-auto bg-slate-800/30 flex justify-center">
            <div ref={previewRef} className="resume-preview-container">
              <div dangerouslySetInnerHTML={{ __html: currentResumeHtml }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'match' && (
        <div className="glass-card overflow-hidden fade-in p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Target size={16} className="text-indigo-400" /> Compare with Job Description
          </h3>
          <textarea
            className="chat-input-field mb-4 min-h-[120px]"
            placeholder="Paste the target job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <button onClick={handleJobMatch} className="btn-primary w-full py-2.5 text-sm">Analyze Match</button>
          
          {matchResult && (
            <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-white/5 slide-up">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <span className="text-sm text-slate-400">Match Score</span>
                <span className={`text-xl font-bold ${matchResult.matchPercentage >= 70 ? 'text-emerald-400' : matchResult.matchPercentage >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {matchResult.matchPercentage}%
                </span>
              </div>
              
              {matchResult.missingSkills.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Missing Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((s, i) => (
                      <span key={i} className="chip bg-red-500/10 text-red-300 border border-red-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {matchResult.improvements.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase">AI Feedback</span>
                  <ul className="space-y-2">
                    {matchResult.improvements.map((imp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5">•</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="glass-card overflow-hidden fade-in">
          <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Personal Portfolio</span>
            <button
              onClick={() => {
                const blob = new Blob([portfolioHtml], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resumeData.personalInfo.fullName.replace(/\\s+/g, '_')}_Portfolio.html`;
                a.click();
              }}
              className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Download size={14} /> Download HTML
            </button>
          </div>
          <div className="p-4 bg-slate-900 overflow-x-auto">
            <iframe 
              srcDoc={portfolioHtml} 
              title="Portfolio Preview"
              className="w-full h-[600px] bg-white rounded-lg border-none"
            />
          </div>
        </div>
      )}

      {activeTab === 'interview' && (
        <div className="glass-card overflow-hidden fade-in p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-400" /> Mock Interview Prep
          </h3>
          <p className="text-xs text-slate-400 mb-5">AI-generated questions based on your resume profile and target role.</p>
          
          <div className="space-y-3">
            {interviewQuestions.map((q, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors group">
                <span className="text-xs font-bold text-indigo-400 mb-1 block">Question {i + 1}</span>
                <p className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="glass-card overflow-hidden fade-in">
          <div className="bg-white/[0.03] px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Structured JSON Data</span>
            <button onClick={handleCopyJSON} className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium">
              {copied ? <><CheckCheck size={14} /> Copied</> : <><Copy size={14} /> Copy Data</>}
            </button>
          </div>
          <pre className="p-5 text-[12px] leading-relaxed text-emerald-300/90 overflow-x-auto font-mono max-h-[600px] overflow-y-auto">
            {JSON.stringify(resumeData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;

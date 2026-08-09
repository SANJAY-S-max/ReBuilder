import { useState } from 'react';
import { Copy, CheckCheck, Download, FileJson } from 'lucide-react';

const JsonTab = ({ resumeData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeData?.personalInfo?.fullName
      ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_ResumeData.json`
      : 'resume.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <FileJson size={22} className="text-indigo-400" />
              Structured JSON
            </h2>
            <p className="text-slate-400">Your resume data in machine-readable format</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-700/60 transition-colors"
            >
              {copied ? <CheckCheck size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <FileJson size={16} className="text-indigo-400" />
              <span className="font-medium">resume.json</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{JSON.stringify(resumeData).length} chars</span>
          </div>

          <pre className="p-5 text-[12px] leading-relaxed text-emerald-200/90 overflow-x-auto font-mono max-h-[70vh] overflow-y-auto">
{JSON.stringify(resumeData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JsonTab;

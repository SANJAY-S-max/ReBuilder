import { useMemo } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { generatePortfolioHTML } from '../../engine/resumeGenerator';

const PortfolioTab = ({ resumeData }) => {
  const portfolioHtml = useMemo(() => (resumeData ? generatePortfolioHTML(resumeData) : ''), [resumeData]);

  const handleDownload = () => {
    const blob = new Blob([portfolioHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Turn your resume into a standalone personal portfolio website instantly.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
        >
          <Download size={14} /> Download HTML
        </button>
        <button
          onClick={() => { const w = window.open(); w.document.write(portfolioHtml); w.document.close(); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
        >
          <ExternalLink size={14} /> Preview Tab
        </button>
      </div>
      <div className="h-60 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <iframe srcDoc={portfolioHtml} title="Portfolio" className="w-full h-full border-none" sandbox="allow-same-origin" />
      </div>
    </div>
  );
};

export default PortfolioTab;

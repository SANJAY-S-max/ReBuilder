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
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Auto-generated portfolio from your resume data.</p>
      <div className="flex gap-2">
        <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-700 text-white rounded-lg text-xs font-medium hover:bg-blue-800">
          <Download size={14} /> Download HTML
        </button>
        <button
          onClick={() => { const w = window.open(); w.document.write(portfolioHtml); w.document.close(); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <ExternalLink size={14} /> Preview
        </button>
      </div>
      <div className="h-48 border border-slate-200 rounded-lg overflow-hidden bg-white">
        <iframe srcDoc={portfolioHtml} title="Portfolio" className="w-full h-full border-none" sandbox="allow-same-origin" />
      </div>
    </div>
  );
};

export default PortfolioTab;

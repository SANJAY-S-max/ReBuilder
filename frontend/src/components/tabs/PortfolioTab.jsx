import { useMemo } from 'react';
import { Globe, Download, ExternalLink } from 'lucide-react';
import { generatePortfolioHTML } from '../../engine/resumeGenerator';

const PortfolioTab = ({ resumeData }) => {
  const portfolioHtml = useMemo(() => {
    return resumeData ? generatePortfolioHTML(resumeData) : '';
  }, [resumeData]);

  const handleDownloadHTML = () => {
    const blob = new Blob([portfolioHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Globe size={24} className="text-indigo-400" />
              Personal Portfolio
            </h2>
            <p className="text-slate-400">Your professional portfolio website generated from resume data</p>
          </div>
          <button
            onClick={handleDownloadHTML}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={16} />
            Download HTML
          </button>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
          {/* Preview Header */}
          <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-slate-400 text-sm ml-4">portfolio-preview.html</span>
              </div>
              <button
                onClick={() => {
                  const newWindow = window.open();
                  newWindow.document.write(portfolioHtml);
                  newWindow.document.close();
                }}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink size={14} />
                Open in New Tab
              </button>
            </div>
          </div>

          {/* Portfolio Content */}
          <div className="h-[600px] bg-white">
            <iframe
              srcDoc={portfolioHtml}
              title="Portfolio Preview"
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </div>

        {/* Portfolio Sections Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-2">👤 About Section</h3>
            <p className="text-xs text-slate-400">Professional summary and contact information</p>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-2">🚀 Projects Showcase</h3>
            <p className="text-xs text-slate-400">Featured projects with descriptions and tech stack</p>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-2">💼 Skills & Experience</h3>
            <p className="text-xs text-slate-400">Technical skills and professional experience timeline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTab;

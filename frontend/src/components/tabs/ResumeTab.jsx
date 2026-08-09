import { useState } from 'react';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ResumeTab = ({ resumeData, resumeHtml, previewRef }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = () => {
    if (!previewRef?.current) return;
    setIsDownloading(true);
    const opt = {
      margin: 0,
      filename: resumeData?.personalInfo?.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(previewRef.current).save().then(() => setIsDownloading(false));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1500px] mx-auto">
        {/* Header with Download Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Resume Preview</h2>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* Resume Preview Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:p-8">
          <div
            className="mx-auto w-full overflow-x-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div
              ref={previewRef}
              className="mx-auto bg-white rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden"
              style={{ width: '900px', minHeight: '1120px' }}
            >
              <div className="p-0" dangerouslySetInnerHTML={{ __html: resumeHtml }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTab;

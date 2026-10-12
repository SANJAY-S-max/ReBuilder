import { useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { renderResume } from '../engine/resumeRenderer';
import { useToast } from './Toast';

const ZOOM_LEVELS = [0.5, 0.6, 0.75, 0.85, 1];

const ResumePreviewPanel = ({ resumeData, customization, previewRef }) => {
  const [zoom, setZoom] = useState(0.75);
  const { addToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const internalRef = previewRef || useRef(null);

  const resumeHtml = useMemo(() => {
    if (!resumeData) return '';
    return renderResume(resumeData, customization);
  }, [resumeData, customization]);

  const handleZoomIn = () => {
    const idx = ZOOM_LEVELS.indexOf(zoom);
    if (idx < ZOOM_LEVELS.length - 1) setZoom(ZOOM_LEVELS[idx + 1]);
  };

  const handleZoomOut = () => {
    const idx = ZOOM_LEVELS.indexOf(zoom);
    if (idx > 0) setZoom(ZOOM_LEVELS[idx - 1]);
  };

  const handleDownload = async () => {
    const el = internalRef.current;
    if (!el) return;
    setIsDownloading(true);
    try {
      const name = resumeData?.personalInfo?.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      await html2pdf().set({
        margin: 0,
        filename: name,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(el).save();

      addToast('PDF downloaded successfully', 'success');
    } catch {
      addToast('Failed to generate PDF', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/90 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_LEVELS[0]}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(0.75)}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset zoom"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hidden sm:inline">
            A4 Print Layout
          </span>
          <button
            onClick={handleDownload}
            disabled={isDownloading || !resumeData}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-all shadow-sm shadow-blue-500/20 active:scale-95"
          >
            <Download size={14} />
            {isDownloading ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-slate-200/50 dark:bg-[#070a14] p-6 custom-scrollbar" style={{ minHeight: '500px' }}>
        <div className="flex justify-center">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: '210mm',
            }}
          >
            {/* Standard printable white A4 sheet with realistic dark shadow */}
            <div
              ref={internalRef}
              className="bg-white text-slate-900 shadow-2xl dark:shadow-[0_25px_80px_rgba(0,0,0,0.85)] ring-1 ring-slate-900/5 dark:ring-white/10"
              style={{ width: '210mm', minHeight: '297mm' }}
              dangerouslySetInnerHTML={{ __html: resumeHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewPanel;

import { useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Download, Undo2, Redo2, Maximize2 } from 'lucide-react';
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
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200 rounded-t-xl">
        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} disabled={zoom <= ZOOM_LEVELS[0]} className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-40" title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-medium text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]} className="p-1.5 rounded hover:bg-white text-slate-600 disabled:opacity-40" title="Zoom in">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom(0.75)} className="p-1.5 rounded hover:bg-white text-slate-600" title="Reset zoom">
            <Maximize2 size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">A4 Preview</span>
          <button
            onClick={handleDownload}
            disabled={isDownloading || !resumeData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            <Download size={14} />
            {isDownloading ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-slate-200/60 p-6 rounded-b-xl" style={{ minHeight: '500px' }}>
        <div className="flex justify-center">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: '210mm',
            }}
          >
            <div
              ref={internalRef}
              className="shadow-2xl"
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

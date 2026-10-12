import { useState, useMemo } from 'react';
import { generateMockInterview } from '../../engine/resumeGenerator';

const InterviewTab = ({ resumeData }) => {
  const questions = useMemo(() => (resumeData ? generateMockInterview(resumeData) : []), [resumeData]);
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        Tailored practice questions generated specifically from your experience and projects.
      </p>
      {questions.map((q, i) => (
        <div key={i} className="border border-slate-200 dark:border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setExpanded(expanded === i ? -1 : i)}
            className="w-full text-left px-3.5 py-3 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400">
                Q{i + 1}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">{q}</p>
          </button>
          {expanded === i && (
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <textarea
                className="w-full h-24 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Type your practice response or key bullet points..."
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InterviewTab;

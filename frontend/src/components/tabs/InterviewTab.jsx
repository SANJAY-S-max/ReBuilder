import { useState, useMemo } from 'react';
import { generateMockInterview } from '../../engine/resumeGenerator';

const InterviewTab = ({ resumeData }) => {
  const questions = useMemo(() => (resumeData ? generateMockInterview(resumeData) : []), [resumeData]);
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Practice questions based on your resume content.</p>
      {questions.map((q, i) => (
        <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === i ? -1 : i)}
            className="w-full text-left px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="text-xs font-semibold text-blue-700">Q{i + 1}</span>
            <p className="text-sm text-slate-800 mt-0.5 line-clamp-2">{q}</p>
          </button>
          {expanded === i && (
            <div className="p-3 border-t border-slate-200">
              <textarea
                className="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Practice your answer here..."
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InterviewTab;

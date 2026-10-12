import { useState } from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { matchJobDescription } from '../../engine/resumeGenerator';

const JobMatchTab = ({ resumeData }) => {
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setMatchResult(matchJobDescription(resumeData, jdText));
      setIsAnalyzing(false);
    }, 800);
  };

  const scoreColor = (s) => s >= 80 ? 'text-emerald-600 dark:text-emerald-400' : s >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
          Target Job Description
        </label>
        <textarea
          className="w-full h-32 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800/90 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
          placeholder="Paste the job description or role requirements to calculate alignment..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={!jdText.trim() || isAnalyzing}
          className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-all shadow-sm shadow-blue-500/20 active:scale-98"
        >
          {isAnalyzing ? 'Analyzing Alignment...' : <><Search size={14} /> Analyze Match</>}
        </button>
      </div>

      {matchResult && (
        <div className="space-y-3.5 fade-in pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-center">
            <div className={`text-3xl font-extrabold font-mono ${scoreColor(matchResult.matchPercentage)}`}>
              {matchResult.matchPercentage}%
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Keyword Compatibility</p>
          </div>

          {matchResult.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <AlertCircle size={13} className="text-amber-500" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {matchResult.improvements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <CheckCircle size={13} className="text-blue-500" /> Actionable Recommendations
              </h4>
              <ul className="space-y-1.5">
                {matchResult.improvements.map((s, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobMatchTab;

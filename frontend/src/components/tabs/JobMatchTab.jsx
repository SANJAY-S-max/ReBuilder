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

  const scoreColor = (s) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">Paste Job Description</label>
        <textarea
          className="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Paste the job description to extract keywords and measure alignment..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={!jdText.trim() || isAnalyzing}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : <><Search size={14} /> Analyze Match</>}
        </button>
      </div>

      {matchResult && (
        <div className="space-y-3 fade-in">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <div className={`text-3xl font-bold ${scoreColor(matchResult.matchPercentage)}`}>{matchResult.matchPercentage}%</div>
            <p className="text-xs text-slate-500 mt-1">Keyword Compatibility</p>
          </div>

          {matchResult.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1"><AlertCircle size={12} /> Missing Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}

          {matchResult.improvements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1"><CheckCircle size={12} /> Suggestions</h4>
              <ul className="space-y-1.5">
                {matchResult.improvements.map((s, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />{s}
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

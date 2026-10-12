import { useState } from 'react';
import { ChevronDown, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const SCORE_LABELS = {
  keywordMatching: 'Keyword Matching',
  sectionCompleteness: 'Section Completeness',
  formatting: 'Formatting',
  skillRelevance: 'Skill Relevance',
  experienceRelevance: 'Experience Relevance',
  readability: 'Readability',
};

const ATSPanel = ({ atsScore }) => {
  const [expanded, setExpanded] = useState(true);

  if (!atsScore) return null;

  const { score, breakdown, missing, suggestions, improvements } = atsScore;
  const Icon = score >= 85 ? CheckCircle : score >= 65 ? AlertTriangle : XCircle;
  const color = score >= 85 ? 'text-emerald-600 dark:text-emerald-400' : score >= 65 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  const bg = score >= 85
    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
    : score >= 65
    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
    : 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800/50';

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-colors ${bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-extrabold font-mono ${color}`}>{score}</div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              ATS Match Score <Icon size={16} className={color} />
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {score >= 85 ? 'Excellent — ready to submit' : score >= 65 ? 'Good — minor improvements recommended' : 'Needs optimization before applying'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 transition-colors"
          title={expanded ? 'Collapse breakdown' : 'Expand breakdown'}
        >
          <ChevronDown size={18} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          {/* Breakdown bars */}
          {breakdown && (
            <div className="space-y-2.5">
              {Object.entries(breakdown).map(([key, val]) => {
                const max = key === 'sectionCompleteness' ? 25 : key === 'keywordMatching' || key === 'formatting' || key === 'skillRelevance' || key === 'experienceRelevance' ? (key === 'formatting' ? 15 : key === 'keywordMatching' ? 20 : 15) : 10;
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{SCORE_LABELS[key] || key}</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{val}/{max}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {missing?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Missing Information
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((m) => (
                  <span key={m} className="px-2 py-0.5 bg-white dark:bg-slate-850 dark:bg-slate-800 rounded-md text-xs font-mono text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {[...(suggestions || []), ...(improvements || [])].length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Recommendations
              </h4>
              <ul className="space-y-1.5">
                {[...(suggestions || []), ...(improvements || [])].map((s, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5 flex-shrink-0" />
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

export default ATSPanel;

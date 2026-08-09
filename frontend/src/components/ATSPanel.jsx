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
  const color = score >= 85 ? 'text-emerald-600' : score >= 65 ? 'text-amber-600' : 'text-red-600';
  const bg = score >= 85 ? 'bg-emerald-50 border-emerald-200' : score >= 65 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className={`rounded-xl border p-5 ${bg}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-bold font-mono ${color}`}>{score}</div>
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
              ATS Score <Icon size={16} className={color} />
            </h3>
            <p className="text-xs text-slate-600">
              {score >= 85 ? 'Excellent — ready to submit' : score >= 65 ? 'Good — minor improvements recommended' : 'Needs optimization before applying'}
            </p>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1 rounded hover:bg-white/50">
          <ChevronDown size={18} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Breakdown bars */}
          {breakdown && (
            <div className="space-y-2">
              {Object.entries(breakdown).map(([key, val]) => {
                const max = key === 'sectionCompleteness' ? 25 : key === 'keywordMatching' || key === 'formatting' || key === 'skillRelevance' || key === 'experienceRelevance' ? (key === 'formatting' ? 15 : key === 'keywordMatching' ? 20 : 15) : 10;
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-600">{SCORE_LABELS[key]}</span>
                      <span className="font-medium text-slate-800">{val}/{max}</span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {missing?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Missing Information</h4>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((m) => (
                  <span key={m} className="px-2 py-0.5 bg-white rounded text-xs text-red-700 border border-red-200">{m}</span>
                ))}
              </div>
            </div>
          )}

          {[...(suggestions || []), ...(improvements || [])].length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Recommendations</h4>
              <ul className="space-y-1">
                {[...(suggestions || []), ...(improvements || [])].map((s, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    {s}
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

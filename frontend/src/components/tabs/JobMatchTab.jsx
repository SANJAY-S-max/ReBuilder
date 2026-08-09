import { useState } from 'react';
import { Target, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { matchJobDescription } from '../../engine/resumeGenerator';

const JobMatchTab = ({ resumeData }) => {
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API delay
    setTimeout(() => {
      const result = matchJobDescription(resumeData, jdText);
      setMatchResult(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-500/20 to-green-500/5';
    if (score >= 60) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Target size={24} className="text-indigo-400" />
            Job Description Match
          </h2>
          <p className="text-slate-400">Compare your resume with a job description to see how well you match</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 lg:p-7 border border-slate-700 mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Paste Job Description
          </label>
          <textarea
            className="w-full h-44 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            placeholder="Paste the complete job description here to analyze how well your resume matches..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-slate-400">
              {jdText.length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={!jdText.trim() || isAnalyzing}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Analyze Match
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {matchResult && (
          <div className="space-y-6 fade-in">
            {/* Match Score Card */}
            <div className={`bg-gradient-to-br ${getScoreBg(matchResult.matchPercentage)} rounded-xl p-6 border border-slate-700`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Match Score</h3>
                  <p className="text-slate-300 text-sm">
                    {matchResult.matchPercentage >= 80 ? 'Excellent match!' : 
                     matchResult.matchPercentage >= 60 ? 'Good match with room for improvement' : 
                     'Significant gaps identified'}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getScoreColor(matchResult.matchPercentage)}`}>
                    {matchResult.matchPercentage}%
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Compatibility</div>
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            {matchResult.missingSkills.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-amber-400" />
                  Missing Keywords & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {matchResult.improvements.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-400" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-3">
                  {matchResult.improvements.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-300 text-sm leading-relaxed">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchTab;

import { useState, useMemo } from 'react';
import { MessageSquare, Send, Brain, CheckCircle } from 'lucide-react';
import { generateMockInterview } from '../../engine/resumeGenerator';

const InterviewTab = ({ resumeData }) => {
  const questions = useMemo(() => {
    return resumeData ? generateMockInterview(resumeData) : [];
  }, [resumeData]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const generateFeedback = () => {
    setIsGeneratingFeedback(true);
    
    // Simulate AI feedback generation
    setTimeout(() => {
      const answeredQuestions = Object.keys(answers).filter(key => answers[key].trim());
      const feedbackData = {
        totalAnswered: answeredQuestions.length,
        totalQuestions: questions.length,
        score: Math.round((answeredQuestions.length / questions.length) * 100),
        suggestions: [
          "Your answers show good technical understanding",
          "Consider adding more specific examples from your experience",
          "Practice explaining complex concepts in simple terms",
          "Highlight your problem-solving approach more clearly"
        ],
        strengths: [
          "Strong technical foundation",
          "Good communication skills",
          "Relevant project experience"
        ]
      };
      setFeedback(feedbackData);
      setIsGeneratingFeedback(false);
    }, 2000);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare size={24} className="text-indigo-400" />
            Interview Preparation
          </h2>
          <p className="text-slate-400">Practice with AI-generated questions based on your resume</p>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Question {index + 1}</h3>
                  <p className="text-slate-300 leading-relaxed">{question}</p>
                </div>
              </div>
              
              <div className="ml-11">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Your Answer
                </label>
                <textarea
                  className="w-full h-24 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Type your answer here..."
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Generate Feedback Button */}
        <div className="mt-8 text-center">
          <button
            onClick={generateFeedback}
            disabled={isGeneratingFeedback || Object.keys(answers).length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            {isGeneratingFeedback ? (
              <>
                <Brain size={16} className="animate-pulse" />
                Generating Feedback...
              </>
            ) : (
              <>
                <Send size={16} />
                Get AI Feedback
              </>
            )}
          </button>
        </div>

        {/* Feedback Results */}
        {feedback && (
          <div className="mt-8 space-y-6 fade-in">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/5 rounded-xl p-6 border border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-400" />
                    Interview Performance
                  </h3>
                  <p className="text-slate-300">
                    You answered {feedback.totalAnswered} out of {feedback.totalQuestions} questions
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-400">{feedback.score}%</div>
                  <div className="text-sm text-slate-400">Completion Rate</div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Your Strengths</h3>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Improvement Suggestions</h3>
              <ul className="space-y-2">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTab;

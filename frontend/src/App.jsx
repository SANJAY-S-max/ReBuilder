import { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ProgressTracker from './components/ProgressTracker';
import TabbedResults from './components/TabbedResults';
import { getQuestionSequence, getQuestion, buildResumeJSON } from './engine/resumeEngine';
import { generateResumeHTML, calculateATSScore } from './engine/resumeGenerator';
import { FileText, RotateCcw, Sparkles } from 'lucide-react';

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

let msgIdCounter = 0;
const nextId = () => ++msgIdCounter;

function App() {
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [userType, setUserType] = useState(null);
  const [questionSequence, setQuestionSequence] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeHtml, setResumeHtml] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [dynamicCounter, setDynamicCounter] = useState(0);
  const [dynamicTotal, setDynamicTotal] = useState(0);
  const [dynamicField, setDynamicField] = useState(null);

  const chatEndRef = useRef(null);
  const previewRef = useRef(null);
  const hasInitialized = useRef(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Start the conversation (guarded against StrictMode double-mount)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const startQ = getQuestion('userType');
    addBotMessage(startQ.question, 600);
    setCurrentQuestion(startQ);
  }, []);

  const addBotMessage = useCallback((text, delay = 500, suggestion = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: nextId(),
        sender: 'bot',
        text,
        timestamp: getTimestamp(),
        suggestion,
      }]);
    }, delay);
  }, []);

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: nextId(),
      sender: 'user',
      text,
      timestamp: getTimestamp(),
    }]);
  };

  const markSectionComplete = (section) => {
    setCompletedSections(prev => prev.includes(section) ? prev : [...prev, section]);
  };

  // Process the next question in sequence
  const advanceToQuestion = useCallback((seq, idx, ans) => {
    if (idx >= seq.length) {
      // All questions done — generate resume
      finishCollection(ans);
      return;
    }

    const qId = seq[idx];
    const q = getQuestion(qId);
    if (!q) {
      advanceToQuestion(seq, idx + 1, ans);
      return;
    }

    // Skip fresher-only questions for experienced users
    if (q.fresherOnly && ans.userType === 'Experienced') {
      advanceToQuestion(seq, idx + 1, ans);
      return;
    }
    // Skip experienced-only questions for freshers
    if (q.experiencedOnly && ans.userType === 'Fresher') {
      advanceToQuestion(seq, idx + 1, ans);
      return;
    }

    setCurrentQIndex(idx);
    setCurrentQuestion(q);
    addBotMessage(q.question, 600, q.suggestion || null);
  }, [addBotMessage]);

  // Handle user input
  const handleSend = (text) => {
    addUserMessage(text);

    // If we're in dynamic item collection mode
    if (dynamicField) {
      handleDynamicInput(text);
      return;
    }

    if (!currentQuestion) return;

    const q = currentQuestion;

    // Validate
    if (q.validate) {
      const error = q.validate(text);
      if (error) {
        addBotMessage(`⚠️ ${error}\n\nPlease try again.`, 400);
        return;
      }
    }

    // Handle skippable fields
    if (q.skippable && text.toLowerCase() === 'skip') {
      const newAnswers = { ...answers, [q.field]: '' };
      setAnswers(newAnswers);
      proceedAfterAnswer(q, newAnswers);
      return;
    }

    // Store answer
    const newAnswers = { ...answers, [q.field]: text };
    setAnswers(newAnswers);

    // Handle special branching
    if (q.id === 'userType') {
      handleUserTypeSelection(text, newAnswers);
      return;
    }

    if (q.id === 'hasCertifications') {
      if (text === 'No') {
        markSectionComplete('certifications');
        proceedAfterAnswer(q, newAnswers);
      } else {
        // Ask for certifications text
        const certQ = getQuestion('certifications');
        setCurrentQuestion(certQ);
        addBotMessage(certQ.question, 600, certQ.suggestion || null);
      }
      return;
    }

    if (q.id === 'hasAchievements') {
      if (text === 'No') {
        markSectionComplete('achievements');
        proceedAfterAnswer(q, newAnswers);
      } else {
        const achQ = getQuestion('achievements');
        setCurrentQuestion(achQ);
        addBotMessage(achQ.question, 600, achQ.suggestion || null);
      }
      return;
    }

    if (q.id === 'hasInternships') {
      if (text === 'No') {
        markSectionComplete('internships');
        proceedAfterAnswer(q, newAnswers);
      } else {
        const intCountQ = getQuestion('internshipCount');
        setCurrentQuestion(intCountQ);
        addBotMessage(intCountQ.question, 600);
      }
      return;
    }

    // Handle count fields that trigger dynamic collection
    if (q.id === 'projectCount') {
      const count = parseInt(text);
      if (count > 0) {
        startDynamicCollection('project', count, newAnswers);
      } else {
        if (userType === 'Fresher') {
          addBotMessage("Since you don't have any projects yet, here are some quick ideas you can build over a weekend:\n\n1. **Personal Portfolio Website** (HTML/CSS/JS)\n2. **Weather App** (Using a free API)\n3. **Task Manager / To-Do App** (React or Vanilla JS)\n\nThese will greatly improve your resume!", 800);
          setTimeout(() => proceedAfterAnswer(q, newAnswers), 1500);
        } else {
          proceedAfterAnswer(q, newAnswers);
        }
      }
      return;
    }

    if (q.id === 'experienceCount') {
      const count = parseInt(text);
      if (count > 0) {
        startDynamicCollection('experience', count, newAnswers);
      } else {
        proceedAfterAnswer(q, newAnswers);
      }
      return;
    }

    if (q.id === 'internshipCount') {
      const count = parseInt(text);
      if (count > 0) {
        startDynamicCollection('internship', count, newAnswers);
      } else {
        markSectionComplete('internships');
        proceedAfterAnswer(q, newAnswers);
      }
      return;
    }

    // Mark section complete when moving away
    if (q.section) {
      markSectionComplete(q.section);
    }

    proceedAfterAnswer(q, newAnswers);
  };

  const handleUserTypeSelection = (type, newAnswers) => {
    const validType = type === 'Fresher' || type === 'Experienced' ? type : null;
    if (!validType) {
      addBotMessage("Please choose either **Fresher** or **Experienced**.", 400);
      return;
    }
    setUserType(validType);
    markSectionComplete('classification');

    const seq = getQuestionSequence(validType);
    setQuestionSequence(seq);

    const greeting = validType === 'Fresher'
      ? "Awesome! Let's build a standout resume that highlights your potential. 🎓"
      : "Great! Let's showcase your professional journey. 💼";

    addBotMessage(greeting, 500);

    setTimeout(() => {
      advanceToQuestion(seq, 0, newAnswers);
    }, 1200);
  };

  const startDynamicCollection = (fieldType, count, ans) => {
    setDynamicField(fieldType);
    setDynamicCounter(1);
    setDynamicTotal(count);

    const q = getQuestion(fieldType);
    const questionText = q.question.replace('{index}', '1');
    addBotMessage(questionText, 600, q.suggestion || null);
  };

  const handleDynamicInput = (text) => {
    const key = `${dynamicField}_${dynamicCounter}`;
    const newAnswers = { ...answers, [key]: text };
    setAnswers(newAnswers);

    if (dynamicCounter < dynamicTotal) {
      const next = dynamicCounter + 1;
      setDynamicCounter(next);
      const q = getQuestion(dynamicField);
      const questionText = q.question.replace('{index}', String(next));
      addBotMessage(questionText, 600, q.suggestion || null);
    } else {
      // Done with dynamic collection
      const sectionMap = { project: 'projects', experience: 'experience', internship: 'internships' };
      markSectionComplete(sectionMap[dynamicField] || dynamicField);
      setDynamicField(null);
      setDynamicCounter(0);
      setDynamicTotal(0);

      // Find current position in sequence and advance
      proceedAfterAnswer(currentQuestion, newAnswers);
    }
  };

  const proceedAfterAnswer = (q, ans) => {
    // Find next question in sequence
    const seq = questionSequence;
    let nextIdx = currentQIndex + 1;

    // If we came from a sub-question (certifications, achievements, etc.), find parent position
    const parentIds = ['certifications', 'achievements', 'internshipCount'];
    if (parentIds.includes(q?.id)) {
      const parentMap = { certifications: 'hasCertifications', achievements: 'hasAchievements', internshipCount: 'hasInternships' };
      const parentId = parentMap[q.id];
      if (parentId) {
        const parentIdx = seq.indexOf(parentId);
        if (parentIdx >= 0) nextIdx = parentIdx + 1;
      }
      if (q.section) markSectionComplete(q.section);
    }

    // For dynamic fields, find the count field position
    const countMap = { project: 'projectCount', experience: 'experienceCount', internship: 'internshipCount' };
    if (countMap[dynamicField] || countMap[q?.field]) {
      const countId = countMap[dynamicField] || countMap[q?.field];
      const countIdx = seq.indexOf(countId);
      if (countIdx >= 0) nextIdx = countIdx + 1;
    }

    advanceToQuestion(seq, nextIdx, ans);
  };

  const finishCollection = (ans) => {
    markSectionComplete('meta');
    addBotMessage("✨ **All done!** Generating your professional resume now...", 600);

    setTimeout(() => {
      const data = buildResumeJSON(ans);
      const html = generateResumeHTML(data);
      const score = calculateATSScore(data);

      setResumeData(data);
      setResumeHtml(html);
      setAtsScore(score);
      setIsComplete(true);

      addBotMessage(
        `🎉 Your resume is ready!\n\n**ATS Score: ${score.score}/100**\n\nSwitch to the **Results** panel to preview, download as PDF, or copy the JSON.\n\n${score.suggestions.length > 0 ? '📝 I also have some suggestions to improve your score — check the details!' : 'Looking great! 🚀'}`,
        800
      );
    }, 1500);
  };

  const handleRestart = () => {
    setMessages([]);
    setAnswers({});
    setUserType(null);
    setQuestionSequence([]);
    setCurrentQIndex(-1);
    setCurrentQuestion(null);
    setIsComplete(false);
    setResumeData(null);
    setResumeHtml('');
    setAtsScore(null);
    setCompletedSections([]);
    setDynamicCounter(0);
    setDynamicTotal(0);
    setDynamicField(null);
    msgIdCounter = 0;

    setTimeout(() => {
      const startQ = getQuestion('userType');
      addBotMessage(startQ.question, 600);
      setCurrentQuestion(startQ);
    }, 300);
  };

  const handleChoiceClick = (choice) => {
    handleSend(choice);
  };

  // Determine if current question has choices
  const showChoices = currentQuestion?.type === 'choice' && !isTyping && !isComplete && !dynamicField;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-bg)' }}>
      {/* Floating orbs */}
      <div className="floating-orb" style={{ width: 400, height: 400, background: '#6366f1', top: '-10%', left: '-5%' }} />
      <div className="floating-orb" style={{ width: 300, height: 300, background: '#8b5cf6', bottom: '10%', right: '-5%' }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                ReBuilder <Sparkles size={16} className="text-indigo-400" />
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">AI Resume Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userType && (
              <span className="chip chip-accent">{userType}</span>
            )}
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Start over"
              id="restart-button"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-[1600px] mx-auto px-6 lg:px-8 py-8 w-full">
        {!isComplete ? (
          <div className="flex gap-6">
            {/* Left Sidebar - Progress */}
            {userType && (
              <aside className="hidden lg:block w-56 flex-shrink-0 slide-in-left">
                <div className="sticky top-24">
                  <ProgressTracker
                    userType={userType}
                    currentSection={currentQuestion?.section || ''}
                    completedSections={completedSections}
                  />
                </div>
              </aside>
            )}

            {/* Chat */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="glass-card-strong flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    <span className="text-sm font-medium text-slate-300">Chat</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {dynamicField ? `Item ${dynamicCounter}/${dynamicTotal}` : `Step ${currentQIndex + 1}`}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                  {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={chatEndRef} />
                </div>

                {/* Choice Buttons */}
                {showChoices && (
                  <div className="px-5 pb-3 flex flex-wrap gap-2 fade-in">
                    {currentQuestion.choices.map(choice => (
                      <button
                        key={choice}
                        onClick={() => handleChoiceClick(choice)}
                        className="btn-choice"
                      >
                        {choice === 'Fresher' && '🎓'}
                        {choice === 'Experienced' && '💼'}
                        {choice === 'Yes' && '✅'}
                        {choice === 'No' && '❌'}
                        {choice}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="px-5 pb-5 pt-2">
                  <ChatInput
                    onSend={handleSend}
                    disabled={isTyping || showChoices}
                    placeholder={currentQuestion?.placeholder || 'Type your answer...'}
                    multiline={currentQuestion?.multiline || false}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="slide-up">
            {resumeData && <TabbedResults resumeData={resumeData} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-4">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-[12px] text-slate-600">
          Built with React, Tailwind CSS & ❤️ — ReBuilder v2.0
        </div>
      </footer>
    </div>
  );
}

export default App;

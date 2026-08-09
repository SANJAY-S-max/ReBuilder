import { useState, useRef, useEffect, useCallback } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { ToastProvider, useToast } from './components/Toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ProgressTracker from './components/ProgressTracker';
import { getQuestionSequence, getQuestion, buildResumeJSON } from './engine/resumeEngine';
import { calculateATSScore } from './engine/resumeGenerator';
import { RotateCcw } from 'lucide-react';

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let msgIdCounter = 0;
const nextId = () => ++msgIdCounter;

function ChatBuilder({ onComplete }) {
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [userType, setUserType] = useState(null);
  const [questionSequence, setQuestionSequence] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [dynamicCounter, setDynamicCounter] = useState(0);
  const [dynamicTotal, setDynamicTotal] = useState(0);
  const [dynamicField, setDynamicField] = useState(null);
  const chatEndRef = useRef(null);
  const hasInitialized = useRef(false);
  const { dispatch } = useResume();
  const { addToast } = useToast();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const startQ = getQuestion('userType');
    addBotMessage(startQ.question, 400);
    setCurrentQuestion(startQ);
  }, []);

  const addBotMessage = useCallback((text, delay = 400, suggestion = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), sender: 'bot', text, timestamp: getTimestamp(), suggestion }]);
    }, delay);
  }, []);

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { id: nextId(), sender: 'user', text, timestamp: getTimestamp() }]);
  };

  const markSectionComplete = (section) => {
    setCompletedSections((prev) => (prev.includes(section) ? prev : [...prev, section]));
  };

  const finishCollection = (ans) => {
    markSectionComplete('meta');
    addBotMessage('All done. Generating your professional resume...', 400);
    setTimeout(() => {
      const data = buildResumeJSON(ans);
      const score = calculateATSScore(data);
      dispatch({ type: 'SET_RESUME', payload: data, atsScore: score });
      dispatch({ type: 'ADD_RESUME_TO_LIST', payload: {
        id: Date.now().toString(),
        name: data.personalInfo.fullName,
        data,
        atsScore: score,
        updatedAt: new Date().toISOString(),
        template: 'classic',
      }});
      addToast('Resume generated successfully', 'success');
      onComplete();
    }, 1200);
  };

  const advanceToQuestion = useCallback((seq, idx, ans) => {
    if (idx >= seq.length) { finishCollection(ans); return; }
    const qId = seq[idx];
    const q = getQuestion(qId);
    if (!q) { advanceToQuestion(seq, idx + 1, ans); return; }
    if (q.fresherOnly && ans.userType === 'Experienced') { advanceToQuestion(seq, idx + 1, ans); return; }
    if (q.experiencedOnly && ans.userType === 'Fresher') { advanceToQuestion(seq, idx + 1, ans); return; }
    setCurrentQIndex(idx);
    setCurrentQuestion(q);
    addBotMessage(q.question, 400, q.suggestion || null);
  }, [addBotMessage]);

  const proceedAfterAnswer = (q, ans) => {
    let nextIdx = currentQIndex + 1;
    const parentIds = ['certifications', 'achievements', 'internshipCount'];
    if (parentIds.includes(q?.id)) {
      const parentMap = { certifications: 'hasCertifications', achievements: 'hasAchievements', internshipCount: 'hasInternships' };
      const parentId = parentMap[q.id];
      if (parentId) { const pi = questionSequence.indexOf(parentId); if (pi >= 0) nextIdx = pi + 1; }
      if (q.section) markSectionComplete(q.section);
    }
    const countMap = { project: 'projectCount', experience: 'experienceCount', internship: 'internshipCount' };
    const countId = countMap[dynamicField] || countMap[q?.field];
    if (countId) { const ci = questionSequence.indexOf(countId); if (ci >= 0) nextIdx = ci + 1; }
    advanceToQuestion(questionSequence, nextIdx, ans);
  };

  const startDynamicCollection = (fieldType, count) => {
    setDynamicField(fieldType);
    setDynamicCounter(1);
    setDynamicTotal(count);
    const q = getQuestion(fieldType);
    addBotMessage(q.question.replace('{index}', '1'), 400, q.suggestion || null);
  };

  const handleDynamicInput = (text) => {
    const key = `${dynamicField}_${dynamicCounter}`;
    const newAnswers = { ...answers, [key]: text };
    setAnswers(newAnswers);
    if (dynamicCounter < dynamicTotal) {
      const next = dynamicCounter + 1;
      setDynamicCounter(next);
      const q = getQuestion(dynamicField);
      addBotMessage(q.question.replace('{index}', String(next)), 400, q.suggestion || null);
    } else {
      const sectionMap = { project: 'projects', experience: 'experience', internship: 'internships' };
      markSectionComplete(sectionMap[dynamicField] || dynamicField);
      setDynamicField(null);
      setDynamicCounter(0);
      setDynamicTotal(0);
      proceedAfterAnswer(currentQuestion, newAnswers);
    }
  };

  const handleSend = (text) => {
    addUserMessage(text);
    if (dynamicField) { handleDynamicInput(text); return; }
    if (!currentQuestion) return;
    const q = currentQuestion;
    if (q.validate) { const err = q.validate(text); if (err) { addBotMessage(`${err} Please try again.`, 300); return; } }
    if (q.skippable && text.toLowerCase() === 'skip') {
      const na = { ...answers, [q.field]: '' };
      setAnswers(na);
      proceedAfterAnswer(q, na);
      return;
    }
    const newAnswers = { ...answers, [q.field]: text };
    setAnswers(newAnswers);

    if (q.id === 'userType') {
      if (text !== 'Fresher' && text !== 'Experienced') { addBotMessage('Please choose **Fresher** or **Experienced**.', 300); return; }
      setUserType(text);
      markSectionComplete('classification');
      const seq = getQuestionSequence(text);
      setQuestionSequence(seq);
      addBotMessage(text === 'Fresher' ? "Let's build a resume that highlights your potential." : "Let's showcase your professional experience.", 400);
      setTimeout(() => advanceToQuestion(seq, 0, newAnswers), 800);
      return;
    }
    if (q.id === 'hasCertifications' && text === 'No') { markSectionComplete('certifications'); proceedAfterAnswer(q, newAnswers); return; }
    if (q.id === 'hasCertifications' && text === 'Yes') { const cq = getQuestion('certifications'); setCurrentQuestion(cq); addBotMessage(cq.question, 400, cq.suggestion); return; }
    if (q.id === 'hasAchievements' && text === 'No') { markSectionComplete('achievements'); proceedAfterAnswer(q, newAnswers); return; }
    if (q.id === 'hasAchievements' && text === 'Yes') { const aq = getQuestion('achievements'); setCurrentQuestion(aq); addBotMessage(aq.question, 400); return; }
    if (q.id === 'hasInternships' && text === 'No') { markSectionComplete('internships'); proceedAfterAnswer(q, newAnswers); return; }
    if (q.id === 'hasInternships' && text === 'Yes') { const iq = getQuestion('internshipCount'); setCurrentQuestion(iq); addBotMessage(iq.question, 400); return; }
    if (q.id === 'projectCount') { const c = parseInt(text); if (c > 0) startDynamicCollection('project', c); else proceedAfterAnswer(q, newAnswers); return; }
    if (q.id === 'experienceCount') { const c = parseInt(text); if (c > 0) startDynamicCollection('experience', c); else proceedAfterAnswer(q, newAnswers); return; }
    if (q.id === 'internshipCount') { const c = parseInt(text); if (c > 0) startDynamicCollection('internship', c); else { markSectionComplete('internships'); proceedAfterAnswer(q, newAnswers); } return; }
    if (q.section) markSectionComplete(q.section);
    proceedAfterAnswer(q, newAnswers);
  };

  const showChoices = currentQuestion?.type === 'choice' && !isTyping && !dynamicField;

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div className="flex gap-6">
        {userType && (
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-4">
              <ProgressTracker userType={userType} currentSection={currentQuestion?.section || ''} completedSections={completedSections} />
            </div>
          </aside>
        )}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Resume Builder</span>
            <span className="text-xs text-slate-400">{dynamicField ? `Item ${dynamicCounter}/${dynamicTotal}` : `Step ${Math.max(currentQIndex + 1, 1)}`}</span>
          </div>
          <div className="px-5 py-5 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
          {showChoices && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {currentQuestion.choices.map((choice) => (
                <button key={choice} onClick={() => handleSend(choice)} className="btn-choice">{choice}</button>
              ))}
            </div>
          )}
          <div className="px-5 pb-5 pt-2">
            <ChatInput onSend={handleSend} disabled={isTyping || showChoices} placeholder={currentQuestion?.placeholder || 'Type your answer...'} multiline={currentQuestion?.multiline || false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { view, dispatch, resumeData } = useResume();
  const [showChat, setShowChat] = useState(false);

  const handleCreateNew = () => {
    setShowChat(true);
    dispatch({ type: 'SET_VIEW', payload: 'create' });
  };

  const handleChatComplete = () => {
    setShowChat(false);
    dispatch({ type: 'SET_VIEW', payload: 'editor' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onCreateNew={handleCreateNew} />
      {view === 'dashboard' && <Dashboard onCreateNew={handleCreateNew} />}
      {(view === 'create' || showChat) && !resumeData && <ChatBuilder onComplete={handleChatComplete} />}
      {view === 'editor' && resumeData && <Editor onBack={handleBack} />}
      {view === 'create' && resumeData && (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">You already have a resume. Open the editor or start fresh.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'editor' })} className="btn-primary">Open Editor</button>
            <button onClick={() => { dispatch({ type: 'RESET' }); setShowChat(true); }} className="btn-secondary flex items-center gap-2"><RotateCcw size={14} /> Start Fresh</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </ToastProvider>
  );
}

export default App;

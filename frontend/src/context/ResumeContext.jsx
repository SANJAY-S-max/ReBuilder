import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { DEFAULT_CUSTOMIZATION } from '../engine/templateConfig';

const ResumeContext = createContext(null);

const MAX_HISTORY = 50;

function resumeReducer(state, action) {
  switch (action.type) {
    case 'SET_RESUME':
      return { ...state, resumeData: action.payload, atsScore: action.atsScore ?? state.atsScore };
    case 'UPDATE_CUSTOMIZATION':
      return { ...state, customization: { ...state.customization, ...action.payload } };
    case 'SET_SECTION_ORDER':
      return { ...state, customization: { ...state.customization, sectionOrder: action.payload } };
    case 'SET_ATS':
      return { ...state, atsScore: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'ADD_RESUME_TO_LIST':
      return { ...state, resumes: [action.payload, ...state.resumes.filter((r) => r.id !== action.payload.id)] };
    case 'LOAD_RESUME':
      return {
        ...state,
        resumeData: action.payload.data,
        customization: action.payload.customization || state.customization,
        atsScore: action.payload.atsScore || null,
        view: 'editor',
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const initialState = {
  view: 'dashboard',
  resumeData: null,
  customization: { ...DEFAULT_CUSTOMIZATION },
  atsScore: null,
  resumes: [],
};

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const pushHistory = useCallback((customization) => {
    const h = historyRef.current.slice(0, historyIndexRef.current + 1);
    h.push(JSON.parse(JSON.stringify(customization)));
    if (h.length > MAX_HISTORY) h.shift();
    historyRef.current = h;
    historyIndexRef.current = h.length - 1;
  }, []);

  const updateCustomization = useCallback((updates) => {
    pushHistory(state.customization);
    dispatch({ type: 'UPDATE_CUSTOMIZATION', payload: updates });
  }, [state.customization, pushHistory]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      dispatch({ type: 'UPDATE_CUSTOMIZATION', payload: historyRef.current[historyIndexRef.current] });
      return true;
    }
    return false;
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      dispatch({ type: 'UPDATE_CUSTOMIZATION', payload: historyRef.current[historyIndexRef.current] });
      return true;
    }
    return false;
  }, []);

  const value = {
    ...state,
    dispatch,
    updateCustomization,
    undo,
    redo,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyRef.current.length - 1,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}

export default ResumeContext;

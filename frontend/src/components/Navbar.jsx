import { FileText, Plus, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onCreateNew }) => {
  const { view, dispatch } = useResume();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 shadow-sm transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          className="flex items-center gap-2.5 group transition-transform hover:scale-[1.01]"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25">
            <FileText size={18} className="text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">ReBuilder</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                PRO
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">Professional Resume Builder</span>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-750 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all"
          >
            {isDark ? (
              <Sun size={17} className="text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon size={17} className="text-slate-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'dashboard'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={onCreateNew}
            className="btn-primary !px-4 !py-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Create Resume</span>
            <span className="sm:hidden">New</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

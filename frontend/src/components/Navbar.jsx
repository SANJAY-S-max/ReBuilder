import { FileText, Plus, LayoutDashboard } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const Navbar = ({ onCreateNew }) => {
  const { view, dispatch } = useResume();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <div className="text-left">
            <span className="text-lg font-bold text-slate-900 tracking-tight">ReBuilder</span>
            <span className="hidden sm:block text-[11px] text-slate-500 font-medium -mt-0.5">Professional Resume Builder</span>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
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

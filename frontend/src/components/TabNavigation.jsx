import { FileText, Layout, Target, Globe, MessageSquare, FileJson } from 'lucide-react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'jobmatch', label: 'Job Match', icon: Target },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'interview', label: 'Interview', icon: MessageSquare },
    { id: 'json', label: 'JSON', icon: FileJson },
  ];

  return (
    <div className="border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 px-6 lg:px-8 py-2 min-w-max" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 border ${
              activeTab === tab.id
                ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500/30 shadow-inner'
                : 'bg-white/[0.03] text-slate-300 border-white/5 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;

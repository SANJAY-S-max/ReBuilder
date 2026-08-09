import { Check, Circle } from 'lucide-react';

const SECTIONS = {
  Fresher: [
    { key: 'personalInfo', label: 'Personal Info', icon: '👤' },
    { key: 'education', label: 'Education', icon: '🎓' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'projects', label: 'Projects', icon: '🛠️' },
    { key: 'internships', label: 'Internships', icon: '💼' },
    { key: 'certifications', label: 'Certifications', icon: '📜' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'meta', label: 'Finish', icon: '🚀' },
  ],
  Experienced: [
    { key: 'personalInfo', label: 'Personal Info', icon: '👤' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'projects', label: 'Projects', icon: '🛠️' },
    { key: 'education', label: 'Education', icon: '🎓' },
    { key: 'certifications', label: 'Certifications', icon: '📜' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'meta', label: 'Finish', icon: '🚀' },
  ],
};

const ProgressTracker = ({ userType, currentSection, completedSections }) => {
  if (!userType) return null;

  const sections = SECTIONS[userType] || SECTIONS.Fresher;

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
        Progress
      </h3>
      <div className="space-y-1">
        {sections.map((section, idx) => {
          const isCompleted = completedSections.includes(section.key);
          const isCurrent = currentSection === section.key;

          return (
            <div
              key={section.key}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-500/10 border border-indigo-500/20'
                  : isCompleted
                  ? 'opacity-60'
                  : 'opacity-30'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] flex-shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {isCompleted ? <Check size={12} /> : section.icon}
              </div>
              <span
                className={`text-[13px] font-medium ${
                  isCurrent
                    ? 'text-indigo-300'
                    : isCompleted
                    ? 'text-slate-400 line-through'
                    : 'text-slate-500'
                }`}
              >
                {section.label}
              </span>
              {isCurrent && <div className="pulse-dot ml-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;

import { Check } from 'lucide-react';

const SECTIONS = {
  Fresher: [
    { key: 'personalInfo', label: 'Personal Info' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'internships', label: 'Internships' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'meta', label: 'Finish' },
  ],
  Experienced: [
    { key: 'personalInfo', label: 'Personal Info' },
    { key: 'experience', label: 'Experience' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'education', label: 'Education' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'meta', label: 'Finish' },
  ],
};

const ProgressTracker = ({ userType, currentSection, completedSections }) => {
  if (!userType) return null;
  const sections = SECTIONS[userType] || SECTIONS.Fresher;

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
        Resume Sections
      </h3>
      <div className="space-y-1">
        {sections.map((section) => {
          const isCompleted = completedSections.includes(section.key);
          const isCurrent = currentSection === section.key;
          return (
            <div
              key={section.key}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all ${
                isCurrent
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-800/60 shadow-sm'
                  : isCompleted
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                  isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                    : isCurrent
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                }`}
              >
                {isCompleted ? <Check size={11} strokeWidth={2.5} /> : '·'}
              </div>
              <span className={`truncate text-xs ${isCompleted ? 'line-through opacity-80' : ''}`}>
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

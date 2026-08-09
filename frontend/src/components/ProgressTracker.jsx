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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Progress</h3>
      <div className="space-y-0.5">
        {sections.map((section) => {
          const isCompleted = completedSections.includes(section.key);
          const isCurrent = currentSection === section.key;
          return (
            <div
              key={section.key}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-all ${
                isCurrent ? 'bg-blue-50 text-blue-800 font-medium' :
                isCompleted ? 'text-slate-400' : 'text-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                isCompleted ? 'bg-emerald-100 text-emerald-600' :
                isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
              }`}>
                {isCompleted ? <Check size={10} /> : '·'}
              </div>
              <span className={isCompleted ? 'line-through' : ''}>{section.label}</span>
              {isCurrent && <div className="pulse-dot ml-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;

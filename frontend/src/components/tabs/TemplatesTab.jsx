import { useEffect, useState } from 'react';
import { TEMPLATES } from '../../engine/templateConfig';
import { useResume } from '../../context/ResumeContext';

const TemplatesTab = ({ onTemplateSelect }) => {
  const { customization, updateCustomization } = useResume();
  const [selected, setSelected] = useState(customization.template);

  useEffect(() => {
    onTemplateSelect?.(selected);
  }, [selected, onTemplateSelect]);

  const handleSelect = (t) => {
    setSelected(t.id);
    updateCustomization({ template: t.id, accentColor: t.accent });
    onTemplateSelect?.(t.id);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => handleSelect(t)}
          className={`p-3 rounded-xl border text-left transition-all ${
            selected === t.id
              ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-1 ring-blue-600 dark:ring-blue-500 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div
            className="h-12 mb-2 rounded-lg flex flex-col justify-end p-2"
            style={{ background: `linear-gradient(180deg, ${t.accent}22, rgba(15, 23, 42, 0.05))` }}
          >
            <div className="h-1 rounded" style={{ background: t.accent, width: '55%' }} />
            <div className="h-0.5 bg-slate-200 dark:bg-slate-700 rounded mt-1 w-full" />
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{t.description}</p>
        </button>
      ))}
    </div>
  );
};

export default TemplatesTab;

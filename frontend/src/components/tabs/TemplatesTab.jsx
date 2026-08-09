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
          className={`p-3 rounded-lg border text-left transition-all ${
            selected === t.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="h-12 mb-2 rounded flex flex-col justify-end p-2" style={{ background: `linear-gradient(180deg, ${t.accent}18, white)` }}>
            <div className="h-1 rounded" style={{ background: t.accent, width: '55%' }} />
            <div className="h-0.5 bg-slate-200 rounded mt-1 w-full" />
          </div>
          <p className="text-xs font-semibold text-slate-800">{t.name}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{t.description}</p>
        </button>
      ))}
    </div>
  );
};

export default TemplatesTab;

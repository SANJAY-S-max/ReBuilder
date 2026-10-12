import { GripVertical } from 'lucide-react';
import { TEMPLATES, FONTS, SECTION_LABELS } from '../engine/templateConfig';
import { useResume } from '../context/ResumeContext';

const CustomizationPanel = () => {
  const { customization, updateCustomization, dispatch, undo, redo, canUndo, canRedo } = useResume();

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex === dropIndex) return;
    const order = [...customization.sectionOrder];
    const [item] = order.splice(dragIndex, 1);
    order.splice(dropIndex, 0, item);
    dispatch({ type: 'SET_SECTION_ORDER', payload: order });
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-6">
      {/* Undo/Redo */}
      <div className="flex gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex-1 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>↩</span> Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex-1 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>↪</span> Redo
        </button>
      </div>

      {/* Template */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2.5">
          Resume Template
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateCustomization({ template: t.id, accentColor: t.accent })}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                customization.template === t.id
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-1 ring-blue-600 dark:ring-blue-500 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="h-1 rounded mb-1.5" style={{ background: t.accent, width: '55%' }} />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
          Typography
        </label>
        <select
          value={customization.font}
          onChange={(e) => updateCustomization({ font: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700/90 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
        >
          {Object.keys(FONTS).map((f) => (
            <option key={f} value={f} className="dark:bg-slate-800 dark:text-slate-100">{f}</option>
          ))}
        </select>
      </div>

      {/* Accent Color */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
          Accent Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customization.accentColor}
            onChange={(e) => updateCustomization({ accentColor: e.target.value })}
            className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent p-0.5"
          />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
            {customization.accentColor}
          </span>
        </div>
      </div>

      {/* Sliders */}
      {[
        { key: 'fontSize', label: 'Font Size', min: 9, max: 12, unit: 'pt' },
        { key: 'sectionSpacing', label: 'Section Spacing', min: 8, max: 24, unit: 'px' },
        { key: 'lineSpacing', label: 'Line Spacing', min: 1.2, max: 1.8, step: 0.05, unit: '' },
        { key: 'margins', label: 'Page Margins', min: 32, max: 64, unit: 'px' },
      ].map(({ key, label, min, max, step, unit }) => (
        <div key={key}>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{label}</label>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{customization[key]}{unit}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step || 1}
            value={customization[key]}
            onChange={(e) => updateCustomization({ [key]: parseFloat(e.target.value) })}
            className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer"
          />
        </div>
      ))}

      {/* Section Order */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
          Section Order
        </label>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">Drag to customize layout order</p>
        <div className="space-y-1.5">
          {customization.sectionOrder.map((key, index) => (
            <div
              key={key}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className="flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg cursor-grab active:cursor-grabbing text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
            >
              <GripVertical size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span>{SECTION_LABELS[key] || key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;

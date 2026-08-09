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
        <button onClick={undo} disabled={!canUndo} className="flex-1 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center gap-1">
          <span className="sr-only">Undo</span>↩ Undo
        </button>
        <button onClick={redo} disabled={!canRedo} className="flex-1 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center gap-1">
          ↪ Redo
        </button>
      </div>

      {/* Template */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Template</label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateCustomization({ template: t.id, accentColor: t.accent })}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                customization.template === t.id
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="h-1 rounded mb-1.5" style={{ background: t.accent, width: '50%' }} />
              <p className="text-xs font-semibold text-slate-800">{t.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Font</label>
        <select
          value={customization.font}
          onChange={(e) => updateCustomization({ font: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
        >
          {Object.keys(FONTS).map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Accent Color */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Accent Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customization.accentColor}
            onChange={(e) => updateCustomization({ accentColor: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border border-slate-200"
          />
          <span className="text-sm text-slate-600 font-mono">{customization.accentColor}</span>
        </div>
      </div>

      {/* Sliders */}
      {[
        { key: 'fontSize', label: 'Font Size', min: 9, max: 12, unit: 'pt' },
        { key: 'sectionSpacing', label: 'Section Spacing', min: 8, max: 24, unit: 'px' },
        { key: 'lineSpacing', label: 'Line Spacing', min: 1.2, max: 1.8, step: 0.05, unit: '' },
        { key: 'margins', label: 'Margins', min: 32, max: 64, unit: 'px' },
      ].map(({ key, label, min, max, step, unit }) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{label}</label>
            <span className="text-xs text-slate-500">{customization[key]}{unit}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step || 1}
            value={customization[key]}
            onChange={(e) => updateCustomization({ [key]: parseFloat(e.target.value) })}
            className="w-full accent-blue-700"
          />
        </div>
      ))}

      {/* Section Order */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Section Order</label>
        <p className="text-xs text-slate-500 mb-2">Drag to reorder sections</p>
        <div className="space-y-1">
          {customization.sectionOrder.map((key, index) => (
            <div
              key={key}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing text-sm text-slate-700 hover:border-slate-300"
            >
              <GripVertical size={14} className="text-slate-400 flex-shrink-0" />
              {SECTION_LABELS[key] || key}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;

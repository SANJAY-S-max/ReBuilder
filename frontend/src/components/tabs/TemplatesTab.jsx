import { useEffect, useState } from 'react';

const TemplatesTab = ({ resumeData, onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');

  useEffect(() => {
    if (!resumeData) return;
    onTemplateSelect?.(selectedTemplate);
  }, [resumeData, onTemplateSelect, selectedTemplate]);

  const templateOptions = [
    { id: 'minimal', name: 'Minimal ATS', description: 'Clean, ATS-friendly', color: 'from-gray-600 to-gray-800' },
    { id: 'corporate', name: 'Corporate Blue', description: 'Professional design', color: 'from-blue-600 to-blue-800' },
    { id: 'two-column', name: 'Two Column', description: 'Balanced layout', color: 'from-indigo-600 to-indigo-800' },
    { id: 'sidebar-left', name: 'Sidebar Left', description: 'Modern sidebar', color: 'from-purple-600 to-purple-800' },
    { id: 'sidebar-right', name: 'Sidebar Right', description: 'Right sidebar', color: 'from-pink-600 to-pink-800' },
    { id: 'developer-dark', name: 'Developer Dark', description: 'Dark theme', color: 'from-gray-800 to-black' },
    { id: 'elegant-serif', name: 'Elegant Serif', description: 'Classic typography', color: 'from-amber-600 to-amber-800' },
    { id: 'compact', name: 'Compact One Page', description: 'Space-efficient', color: 'from-green-600 to-green-800' },
    { id: 'creative', name: 'Creative Designer', description: 'Colorful design', color: 'from-rose-600 to-rose-800' },
    { id: 'tech', name: 'Tech-Focused', description: 'Developer style', color: 'from-cyan-600 to-cyan-800' }
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
          <p className="text-slate-400">Select a professional template that best represents your style</p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {templateOptions.map((template) => (
            <div
              key={template.id}
              className={`
                relative bg-slate-800/50 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer
                ${selectedTemplate === template.id 
                  ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' 
                  : 'border-slate-700 hover:border-slate-600'
                }
              `}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {/* Template Preview Header */}
              <div className={`h-32 bg-gradient-to-br ${template.color} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium opacity-90">Preview</div>
                  <div className="text-xs opacity-75">Professional Resume</div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{template.description}</p>
                
                <button className={`
                  w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors
                  ${selectedTemplate === template.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }
                `}>
                  {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Template Info */}
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 text-slate-300">
            <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              Currently selected: <strong className="text-white">{templateOptions.find(t => t.id === selectedTemplate)?.name}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesTab;

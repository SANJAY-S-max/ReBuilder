// Re-exports professional renderer + legacy feature modules
export {
  renderResume,
  generateResumeHTML,
  generateAllResumeTemplates,
  calculateATSScore,
  enhanceBullet,
  enhanceSkills,
  categorizeSkills,
  generateSummary,
  getTemplateList,
  DEFAULT_CUSTOMIZATION,
  TEMPLATES,
  FONTS,
  SECTION_LABELS,
} from './resumeRenderer.js';

export { matchJobDescription, generatePortfolioHTML, generateMockInterview } from './resumeFeatures.js';

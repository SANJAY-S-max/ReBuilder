export const FONTS = {
  Inter: '"Inter", system-ui, sans-serif',
  Roboto: '"Roboto", "Helvetica", sans-serif',
  Arial: 'Arial, Helvetica, sans-serif',
  Helvetica: 'Helvetica, Arial, sans-serif',
  Calibri: 'Calibri, "Segoe UI", sans-serif',
};

export const DEFAULT_CUSTOMIZATION = {
  font: 'Inter',
  accentColor: '#1e40af',
  fontSize: 10,
  sectionSpacing: 14,
  lineSpacing: 1.45,
  margins: 48,
  template: 'classic',
  sectionOrder: [
    'summary',
    'education',
    'skills',
    'experience',
    'internships',
    'projects',
    'certifications',
    'achievements',
    'positions',
    'coursework',
    'additional',
  ],
};

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Timeless single-column layout trusted by recruiters',
    accent: '#1e40af',
    layout: 'single',
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean typography with subtle accent lines',
    accent: '#0f766e',
    layout: 'single',
  },
  {
    id: 'engineer',
    name: 'Software Engineer',
    description: 'Technical focus with categorized skills',
    accent: '#4338ca',
    layout: 'single',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Structured format for business roles',
    accent: '#1d4ed8',
    layout: 'single',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Education-first layout for students and researchers',
    accent: '#7c2d12',
    layout: 'single',
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Polished design with restrained visual hierarchy',
    accent: '#6d28d9',
    layout: 'single',
  },
];

export const SECTION_LABELS = {
  summary: 'Professional Summary',
  education: 'Education',
  skills: 'Technical Skills',
  experience: 'Experience',
  internships: 'Internships',
  projects: 'Projects',
  certifications: 'Certifications',
  achievements: 'Achievements',
  positions: 'Positions of Responsibility',
  coursework: 'Relevant Coursework',
  additional: 'Additional Information',
};

export const SKILL_CATEGORIES = {
  Languages: ['c++', 'c', 'java', 'python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'c#', 'php', 'ruby', 'scala', 'r'],
  Web: ['html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap', 'responsive design'],
  Frameworks: ['react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask', 'spring', 'spring boot', '.net', 'flutter'],
  Database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'firebase', 'dynamodb'],
  'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'linux'],
  Tools: ['git', 'github', 'gitlab', 'jira', 'figma', 'postman', 'vs code', 'vscode', 'excel', 'power bi'],
  'Soft Skills': ['agile', 'scrum', 'leadership', 'communication', 'problem solving', 'teamwork'],
};

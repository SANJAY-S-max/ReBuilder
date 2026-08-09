import {
  FONTS,
  DEFAULT_CUSTOMIZATION,
  TEMPLATES,
  SECTION_LABELS,
  SKILL_CATEGORIES,
} from './templateConfig.js';

// ─── Content enhancement (never invent facts) ─────────────────

const ACTION_VERBS = ['Developed', 'Engineered', 'Built', 'Designed', 'Implemented', 'Led', 'Optimized', 'Created', 'Delivered', 'Collaborated'];

function removeWeakLanguage(text) {
  return text
    .replace(/^(i |my |we |our )/i, '')
    .replace(/\b(did|made|worked on|helped with|was responsible for|was involved in)\b/gi, '')
    .replace(/\b(very|really|just|basically|simply)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function enhanceBullet(raw) {
  let text = raw.replace(/^[-•*▪▸]\s*/, '').trim();
  if (!text) return '';
  text = removeWeakLanguage(text);

  const startsWithAction = /^(Developed|Engineered|Built|Designed|Implemented|Created|Led|Managed|Optimized|Enhanced|Deployed|Integrated|Automated|Delivered|Collaborated|Reduced|Increased|Improved|Maintained|Executed|Architected|Spearheaded|Streamlined|Analyzed|Researched|Configured|Migrated|Refactored)/i;

  if (!startsWithAction.test(text)) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    text = text.charAt(0).toLowerCase() + text.slice(1);
    text = `${verb} ${text}`;
  }
  if (!/[.!]$/.test(text)) text += '.';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function enhanceSkills(skills) {
  const acronyms = {
    html: 'HTML', css: 'CSS', js: 'JavaScript', ts: 'TypeScript', sql: 'SQL',
    aws: 'AWS', gcp: 'GCP', api: 'API', ui: 'UI', ux: 'UX', ai: 'AI', ml: 'ML',
    git: 'Git', github: 'GitHub', react: 'React', nodejs: 'Node.js', 'node.js': 'Node.js',
    mongodb: 'MongoDB', postgresql: 'PostgreSQL', mysql: 'MySQL', python: 'Python',
    java: 'Java', 'c++': 'C++', docker: 'Docker', kubernetes: 'Kubernetes',
    django: 'Django', flask: 'Flask', angular: 'Angular', vue: 'Vue.js',
    'next.js': 'Next.js', graphql: 'GraphQL', rest: 'REST', figma: 'Figma',
    jira: 'Jira', agile: 'Agile', scrum: 'Scrum', linux: 'Linux', vscode: 'VS Code',
    'vs code': 'VS Code', postman: 'Postman', 'ci/cd': 'CI/CD', tailwind: 'Tailwind CSS',
  };
  const seen = new Set();
  return skills
    .map((s) => {
      let skill = s.trim();
      const key = skill.toLowerCase().replace(/\s+/g, '');
      if (acronyms[key]) skill = acronyms[key];
      else if (acronyms[skill.toLowerCase()]) skill = acronyms[skill.toLowerCase()];
      else skill = skill.charAt(0).toUpperCase() + skill.slice(1);
      const lower = skill.toLowerCase();
      if (seen.has(lower)) return null;
      seen.add(lower);
      return skill;
    })
    .filter(Boolean);
}

export function categorizeSkills(skills) {
  const enhanced = enhanceSkills(skills);
  const categorized = {};
  const used = new Set();

  Object.entries(SKILL_CATEGORIES).forEach(([category, keywords]) => {
    const matched = enhanced.filter((skill) => {
      const lower = skill.toLowerCase();
      return keywords.some((kw) => lower.includes(kw) || kw.includes(lower));
    });
    if (matched.length > 0) {
      categorized[category] = matched;
      matched.forEach((s) => used.add(s.toLowerCase()));
    }
  });

  const uncategorized = enhanced.filter((s) => !used.has(s.toLowerCase()));
  if (uncategorized.length > 0) {
    categorized.Other = uncategorized;
  }
  return categorized;
}

function parseExperience(raw) {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: '', company: '', duration: '', bullets: [] };

  const parts = lines[0].split(/[\s]*[—–|][\s]*/);
  const company = parts[0]?.trim() || '';
  const title = parts[1]?.trim() || '';
  const duration = parts[2]?.trim() || '';
  const bullets = lines.slice(1).map(enhanceBullet).filter(Boolean);

  if (bullets.length === 0 && lines.length === 1) {
    bullets.push('[Add achievement bullets describing your impact and technologies used]');
  }

  return { title, company, duration, bullets };
}

function parseProject(raw) {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: '', stack: '', bullets: [] };

  let title = lines[0];
  let descLines = lines.slice(1);
  const dashSplit = title.match(/^(.+?)[\s]*[—–-][\s]*(.+)$/);
  if (dashSplit && descLines.length === 0) {
    title = dashSplit[1].trim();
    descLines = [dashSplit[2].trim()];
  }

  let stack = '';
  const bullets = [];
  descLines.forEach((line) => {
    const techMatch = line.match(/^(tech|stack|built with|using|technologies?)[\s:]+(.+)/i);
    if (techMatch) stack = techMatch[2].trim();
    else bullets.push(enhanceBullet(line));
  });

  if (bullets.length === 0) {
    bullets.push('[Add project description: what was built, key implementation, and measurable impact]');
  }

  return { title: removeWeakLanguage(title), stack, bullets };
}

function parseEducation(raw) {
  const parts = raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const degree = parts[0] || raw;
  let institution = parts[1] || '';
  let year = '';
  let grade = '';
  parts.forEach((p) => {
    if (/\b(20\d{2})\b/.test(p) && !year) year = p;
    else if (/\b(cgpa|gpa|percentage|%|\d\.\d)\b/i.test(p) && !grade) grade = p;
  });
  return { degree, institution, year, grade };
}

export function generateSummary(data) {
  const { skills, userType, targetRole, projects, internships, education } = data;
  const topSkills = enhanceSkills(skills.slice(0, 6)).join(', ');
  const eduText = education[0]?.details?.toLowerCase() || '';
  let field = '';
  if (/computer/.test(eduText)) field = 'Computer Science';
  else if (/information/.test(eduText)) field = 'Information Technology';
  else if (/electronic/.test(eduText)) field = 'Electronics Engineering';
  else if (/mechanical/.test(eduText)) field = 'Mechanical Engineering';
  else if (/data/.test(eduText)) field = 'Data Science';

  if (userType === 'Fresher') {
    const parts = [];
    parts.push(`Motivated ${field || 'graduate'} targeting a ${targetRole || 'professional'} role`);
    if (topSkills) parts.push(`with proficiency in ${topSkills}`);
    if (projects.length > 0) parts.push(`and hands-on experience from ${projects.length} project${projects.length > 1 ? 's' : ''}`);
    if (internships.length > 0) parts.push('supported by internship experience');
    parts.push('seeking to contribute technical skills and deliver measurable results.');
    return parts.join(', ').replace(', and', ' and').replace(', supported', ', supported');
  }

  return `Results-oriented ${targetRole || 'professional'} with proven experience in ${topSkills || 'relevant technologies'}. Skilled at delivering scalable solutions, collaborating across teams, and driving measurable outcomes in ${targetRole || 'technical'} roles.`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatLink(url, label) {
  if (!url) return '';
  const href = url.startsWith('http') ? url : `https://${url}`;
  return `<a href="${escapeHtml(href)}" style="color:inherit;text-decoration:none;">${escapeHtml(label || url)}</a>`;
}

function splitLinks(linkedin) {
  if (!linkedin || linkedin.toLowerCase() === 'skip') return { linkedin: '', github: '', portfolio: '' };
  const parts = linkedin.split(/[,|\n]/).map((s) => s.trim()).filter(Boolean);
  const result = { linkedin: '', github: '', portfolio: '' };
  parts.forEach((p) => {
    const lower = p.toLowerCase();
    if (lower.includes('github')) result.github = p;
    else if (lower.includes('linkedin')) result.linkedin = p;
    else if (!result.portfolio) result.portfolio = p;
    else if (!result.linkedin) result.linkedin = p;
  });
  if (!result.linkedin && parts[0] && parts[0].toLowerCase().includes('linkedin')) result.linkedin = parts[0];
  return result;
}

// ─── Section builders ───────────────────────────────────────

function buildHeader(data, config, templateId) {
  const { personalInfo, targetRole } = data;
  const links = splitLinks(personalInfo.linkedin);
  const contactLine = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
  ].filter(Boolean).map(escapeHtml).join(' | ');

  const linkLine = [
    links.linkedin ? formatLink(links.linkedin, 'LinkedIn') : '',
    links.github ? formatLink(links.github, 'GitHub') : '',
    links.portfolio ? formatLink(links.portfolio, 'Portfolio') : '',
  ].filter(Boolean).join(' | ');

  const nameStyle = templateId === 'academic'
    ? 'font-size:22pt;font-weight:700;letter-spacing:0.5px;'
    : 'font-size:24pt;font-weight:700;letter-spacing:0.3px;';

  return `
    <header class="rb-header" style="margin-bottom:${config.sectionSpacing}px;text-align:${templateId === 'creative' ? 'left' : 'center'};">
      <h1 style="${nameStyle}color:#111827;margin:0 0 4px 0;">${escapeHtml(personalInfo.fullName)}</h1>
      ${targetRole ? `<div style="font-size:${config.fontSize + 1}pt;color:${config.accentColor};font-weight:600;margin-bottom:8px;">${escapeHtml(targetRole)}</div>` : ''}
      ${contactLine ? `<div style="font-size:${config.fontSize - 1}pt;color:#4b5563;margin-bottom:3px;">${contactLine}</div>` : ''}
      ${linkLine ? `<div style="font-size:${config.fontSize - 1}pt;color:#4b5563;">${linkLine}</div>` : ''}
    </header>`;
}

function buildSectionHeading(title, config, templateId) {
  const styles = {
    classic: `font-size:${config.fontSize + 2}pt;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;border-bottom:1.5px solid ${config.accentColor};padding-bottom:3px;margin-bottom:8px;color:#111827;`,
    modern: `font-size:${config.fontSize + 2}pt;font-weight:700;color:${config.accentColor};border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:8px;`,
    engineer: `font-size:${config.fontSize + 2}pt;font-weight:700;color:#111827;border-left:3px solid ${config.accentColor};padding-left:8px;margin-bottom:8px;`,
    corporate: `font-size:${config.fontSize + 2}pt;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${config.accentColor};background:#f8fafc;padding:4px 8px;margin-bottom:8px;`,
    academic: `font-size:${config.fontSize + 2}pt;font-weight:700;font-style:italic;border-bottom:1px solid #d1d5db;padding-bottom:3px;margin-bottom:8px;color:#1f2937;`,
    creative: `font-size:${config.fontSize + 2}pt;font-weight:700;color:#111827;margin-bottom:8px;display:flex;align-items:center;gap:8px;`,
  };
  const style = styles[templateId] || styles.classic;
  const accent = templateId === 'creative' ? `<span style="width:24px;height:2px;background:${config.accentColor};display:inline-block;"></span>` : '';
  return `<h2 style="${style}">${accent}${escapeHtml(title)}</h2>`;
}

function buildSummarySection(data, config, templateId) {
  const summary = generateSummary(data);
  if (!summary) return '';
  return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(SECTION_LABELS.summary, config, templateId)}<p style="font-size:${config.fontSize}pt;color:#374151;margin:0;text-align:justify;">${escapeHtml(summary)}</p></section>`;
}

function buildEducationSection(data, config, templateId) {
  const items = data.education.filter((e) => e.details?.trim());
  if (items.length === 0) return '';
  let content = items.map((edu) => {
    const p = parseEducation(edu.details);
    const meta = [p.year, p.grade].filter(Boolean).join(' | ');
    return `
      <div style="margin-bottom:8px;">
        <div style="font-size:${config.fontSize + 1}pt;font-weight:600;color:#111827;">${escapeHtml(p.degree)}</div>
        ${p.institution ? `<div style="font-size:${config.fontSize}pt;color:#374151;">${escapeHtml(p.institution)}</div>` : ''}
        ${meta ? `<div style="font-size:${config.fontSize - 1}pt;color:#6b7280;">${escapeHtml(meta)}</div>` : ''}
      </div>`;
  }).join('');
  return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(SECTION_LABELS.education, config, templateId)}${content}</section>`;
}

function buildSkillsSection(data, config, templateId) {
  if (!data.skills?.length) return '';
  const categorized = categorizeSkills(data.skills);
  const entries = Object.entries(categorized);
  if (entries.length === 0) return '';

  const content = entries.map(([cat, items]) =>
    `<div style="margin-bottom:4px;font-size:${config.fontSize}pt;"><strong style="color:#111827;">${escapeHtml(cat)}:</strong> <span style="color:#374151;">${items.map(escapeHtml).join(', ')}</span></div>`
  ).join('');

  return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(SECTION_LABELS.skills, config, templateId)}${content}</section>`;
}

function buildExperienceSection(data, config, templateId, label = SECTION_LABELS.experience) {
  const items = data.experience.filter((e) => e.details?.trim());
  if (items.length === 0) return '';

  const content = items.map((exp) => {
    const p = parseExperience(exp.details);
    const heading = [p.title, p.company].filter(Boolean).join(' — ');
    return `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px;">
          <div style="font-size:${config.fontSize + 1}pt;font-weight:600;color:#111827;">${escapeHtml(heading)}</div>
          ${p.duration ? `<div style="font-size:${config.fontSize - 1}pt;color:#6b7280;white-space:nowrap;margin-left:12px;">${escapeHtml(p.duration)}</div>` : ''}
        </div>
        <ul style="margin:0;padding-left:16px;">${p.bullets.map((b) => `<li style="font-size:${config.fontSize}pt;color:#374151;margin-bottom:2px;">${b.startsWith('[') ? `<em style="color:#9ca3af;">${escapeHtml(b)}</em>` : escapeHtml(b)}</li>`).join('')}</ul>
      </div>`;
  }).join('');

  return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(label, config, templateId)}${content}</section>`;
}

function buildInternshipsSection(data, config, templateId) {
  const items = data.internships.filter((e) => e.details?.trim());
  if (items.length === 0) return '';
  const temp = { ...data, experience: items };
  return buildExperienceSection(temp, config, templateId, SECTION_LABELS.internships);
}

function buildProjectsSection(data, config, templateId) {
  const items = data.projects.filter((p) => p.details?.trim());
  if (items.length === 0) return '';

  const content = items.map((proj) => {
    const p = parseProject(proj.details);
    return `
      <div style="margin-bottom:10px;">
        <div style="font-size:${config.fontSize + 1}pt;font-weight:600;color:#111827;">${escapeHtml(p.title)}</div>
        ${p.stack ? `<div style="font-size:${config.fontSize - 1}pt;color:${config.accentColor};margin-bottom:3px;"><em>${escapeHtml(p.stack)}</em></div>` : ''}
        <ul style="margin:0;padding-left:16px;">${p.bullets.map((b) => `<li style="font-size:${config.fontSize}pt;color:#374151;margin-bottom:2px;">${b.startsWith('[') ? `<em style="color:#9ca3af;">${escapeHtml(b)}</em>` : escapeHtml(b)}</li>`).join('')}</ul>
      </div>`;
  }).join('');

  return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(SECTION_LABELS.projects, config, templateId)}${content}</section>`;
}

function buildListSection(key, items, config, templateId) {
  const filtered = items.filter((i) => (typeof i === 'string' ? i.trim() : i.details?.trim()));
  if (filtered.length === 0) return '';

  const list = filtered.map((item) => {
    const text = typeof item === 'string' ? enhanceBullet(item) : enhanceBullet(item.details);
    return `<li style="font-size:${config.fontSize}pt;color:#374151;margin-bottom:2px;">${escapeHtml(text)}</li>`;
  }).join('');

  return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(SECTION_LABELS[key], config, templateId)}<ul style="margin:0;padding-left:16px;">${list}</ul></section>`;
}

const SECTION_BUILDERS = {
  summary: buildSummarySection,
  education: buildEducationSection,
  skills: buildSkillsSection,
  experience: buildExperienceSection,
  internships: buildInternshipsSection,
  projects: buildProjectsSection,
  certifications: (data, config, templateId) => buildListSection('certifications', data.certifications, config, templateId),
  achievements: (data, config, templateId) => buildListSection('achievements', data.achievements, config, templateId),
  positions: (data, config, templateId) => buildListSection('positions', data.positions || [], config, templateId),
  coursework: (data, config, templateId) => buildListSection('coursework', data.coursework || [], config, templateId),
  additional: (data, config, templateId) => {
    if (!data.additionalInfo?.trim()) return '';
    return `<section style="margin-bottom:${config.sectionSpacing}px;">${buildSectionHeading(SECTION_LABELS.additional, config, templateId)}<p style="font-size:${config.fontSize}pt;color:#374151;margin:0;">${escapeHtml(data.additionalInfo)}</p></section>`;
  },
};

// ─── Main render ──────────────────────────────────────────────

export function renderResume(data, customization = {}) {
  const config = { ...DEFAULT_CUSTOMIZATION, ...customization };
  const templateId = config.template || 'classic';
  const fontFamily = FONTS[config.font] || FONTS.Inter;

  let sectionOrder = config.sectionOrder || DEFAULT_CUSTOMIZATION.sectionOrder;

  // Academic template: education first
  if (templateId === 'academic') {
    sectionOrder = ['summary', 'education', 'coursework', 'skills', 'projects', 'internships', 'experience', 'certifications', 'achievements', 'positions', 'additional'];
  }

  const sections = sectionOrder
    .map((key) => {
      const builder = SECTION_BUILDERS[key];
      return builder ? builder(data, config, templateId) : '';
    })
    .filter(Boolean)
    .join('');

  const html = `
    <div class="rb-resume" style="
      font-family:${fontFamily};
      font-size:${config.fontSize}pt;
      line-height:${config.lineSpacing};
      color:#1f2937;
      background:#ffffff;
      padding:${config.margins}px;
      width:210mm;
      min-height:297mm;
      box-sizing:border-box;
    ">
      ${buildHeader(data, config, templateId)}
      ${sections}
    </div>`;

  return html;
}

export function getTemplateList() {
  return TEMPLATES;
}

export { DEFAULT_CUSTOMIZATION, TEMPLATES, FONTS, SECTION_LABELS };

// ─── Enhanced ATS Score ───────────────────────────────────────

export function calculateATSScore(data, jobKeywords = []) {
  const breakdown = {
    keywordMatching: 0,
    sectionCompleteness: 0,
    formatting: 0,
    skillRelevance: 0,
    experienceRelevance: 0,
    readability: 0,
  };
  const missing = [];
  const suggestions = [];
  const improvements = [];

  // Keyword matching (20)
  if (jobKeywords.length > 0) {
    const resumeText = JSON.stringify(data).toLowerCase();
    const matched = jobKeywords.filter((kw) => resumeText.includes(kw.toLowerCase()));
    breakdown.keywordMatching = Math.round((matched.length / jobKeywords.length) * 20);
    if (matched.length < jobKeywords.length * 0.5) {
      suggestions.push(`Incorporate missing keywords: ${jobKeywords.filter((k) => !resumeText.includes(k.toLowerCase())).slice(0, 5).join(', ')}`);
    }
  } else {
    breakdown.keywordMatching = data.skills.length >= 8 ? 18 : data.skills.length >= 5 ? 14 : 8;
  }

  // Section completeness (25)
  let sections = 0;
  if (data.personalInfo?.fullName) sections += 3; else missing.push('Full Name');
  if (data.personalInfo?.email) sections += 3; else missing.push('Email');
  if (data.personalInfo?.phone) sections += 2; else missing.push('Phone');
  if (data.personalInfo?.location) sections += 2;
  if (data.targetRole) sections += 3; else missing.push('Target Role');
  if (data.education[0]?.details) sections += 4; else missing.push('Education');
  if (data.skills.length >= 5) sections += 4; else suggestions.push('Add at least 5–8 technical skills for better keyword coverage.');
  if (data.projects.length >= 2 || data.experience.length >= 1 || data.internships.length >= 1) sections += 4;
  breakdown.sectionCompleteness = Math.min(sections, 25);

  // Formatting (15) — always good with our templates
  breakdown.formatting = 14;
  if (!data.personalInfo?.linkedin) suggestions.push('Add LinkedIn or GitHub for professional credibility.');

  // Skill relevance (15)
  if (data.skills.length >= 10) breakdown.skillRelevance = 15;
  else if (data.skills.length >= 7) breakdown.skillRelevance = 12;
  else if (data.skills.length >= 5) breakdown.skillRelevance = 9;
  else {
    breakdown.skillRelevance = 5;
    improvements.push('Expand your skills section with relevant tools and frameworks.');
  }

  // Experience relevance (15)
  if (data.userType === 'Experienced') {
    if (data.experience.length >= 2) breakdown.experienceRelevance = 15;
    else if (data.experience.length >= 1) breakdown.experienceRelevance = 10;
    else {
      breakdown.experienceRelevance = 3;
      improvements.push('Add work experience with quantified achievements.');
    }
  } else {
    let exp = 0;
    if (data.internships.length >= 1) exp += 8;
    if (data.projects.length >= 3) exp += 7;
    else if (data.projects.length >= 2) exp += 5;
    else improvements.push('Add 2–3 projects with tech stack and measurable outcomes.');
    breakdown.experienceRelevance = Math.min(exp, 15);
  }

  // Readability (10)
  let read = 6;
  if (data.certifications.length >= 1) read += 2;
  if (data.achievements.length >= 1) read += 2;
  breakdown.readability = Math.min(read, 10);

  const score = Math.min(100, Object.values(breakdown).reduce((a, b) => a + b, 0));

  return { score, breakdown, missing, suggestions, improvements };
}

// Backward-compatible exports
export function generateResumeHTML(data, templateType = 'classic', customization = {}) {
  const templateMap = {
    minimal: 'classic', corporate: 'corporate', 'two-column': 'modern',
    'sidebar-left': 'modern', 'sidebar-right': 'corporate', 'developer-dark': 'engineer',
    'elegant-serif': 'academic', compact: 'modern', creative: 'creative', tech: 'engineer',
    classic: 'classic', modern: 'modern', engineer: 'engineer', academic: 'academic',
  };
  return renderResume(data, { ...customization, template: templateMap[templateType] || templateType });
}

export function generateAllResumeTemplates(data, customization = {}) {
  return {
    templates: TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      html: renderResume(data, { ...customization, template: t.id, accentColor: t.accent }),
    })),
  };
}


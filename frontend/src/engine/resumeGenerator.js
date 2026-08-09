// ═══════════════════════════════════════════════════════════════
// Resume Enhancement & Generation Engine
// CORE RULE: NEVER copy user input as-is. ALWAYS transform.
// ═══════════════════════════════════════════════════════════════

// ─── ACTION VERB LIBRARY ────────────────────────────────────
const ACTION_VERBS = {
  dev: ['Developed', 'Engineered', 'Architected', 'Built', 'Designed', 'Implemented', 'Constructed'],
  lead: ['Led', 'Directed', 'Managed', 'Orchestrated', 'Spearheaded', 'Coordinated'],
  improve: ['Optimized', 'Enhanced', 'Streamlined', 'Accelerated', 'Elevated', 'Refined'],
  create: ['Created', 'Established', 'Launched', 'Initiated', 'Pioneered', 'Introduced'],
  analyze: ['Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched'],
  collab: ['Collaborated', 'Partnered', 'Contributed', 'Facilitated'],
};

function pickVerb(category) {
  const list = ACTION_VERBS[category] || ACTION_VERBS.dev;
  return list[Math.floor(Math.random() * list.length)];
}

// ─── WEAK WORD PATTERNS ─────────────────────────────────────
const WEAK_PATTERNS = [
  { regex: /^(i |my |we |our )/i, replace: '' },
  { regex: /\b(did|made|worked on|helped with|was responsible for|was involved in)\b/gi, replace: '' },
  { regex: /\b(good|nice|great|awesome|cool)\b/gi, replace: 'robust' },
  { regex: /\b(stuff|things|etc)\b/gi, replace: '' },
  { regex: /\b(very|really|just|basically|simply)\b/gi, replace: '' },
];

function removeWeakLanguage(text) {
  let cleaned = text;
  WEAK_PATTERNS.forEach(({ regex, replace }) => {
    cleaned = cleaned.replace(regex, replace);
  });
  // Collapse extra spaces
  return cleaned.replace(/\s{2,}/g, ' ').trim();
}

// ─── BULLET POINT ENHANCER ──────────────────────────────────
function enhanceBullet(raw) {
  let text = raw.replace(/^[-•*▪▸]\s*/, '').trim();
  if (!text) return '';

  // Remove weak language
  text = removeWeakLanguage(text);

  // If it already starts with a strong past-tense action verb, keep it
  const startsWithAction = /^(Developed|Engineered|Built|Designed|Implemented|Created|Led|Managed|Optimized|Enhanced|Deployed|Integrated|Automated|Configured|Analyzed|Architected|Spearheaded|Launched|Established|Streamlined|Collaborated|Contributed|Facilitated|Constructed|Pioneered|Introduced|Evaluated|Researched|Reduced|Increased|Improved|Delivered|Maintained|Executed|Orchestrated|Migrated|Refactored)/i;

  if (!startsWithAction.test(text)) {
    // Detect context and prepend appropriate verb
    const lc = text.toLowerCase();
    let verb;
    if (/\b(team|group|manage|lead|mentor)\b/.test(lc)) verb = pickVerb('lead');
    else if (/\b(improv|optim|fast|speed|reduc|perform)\b/.test(lc)) verb = pickVerb('improve');
    else if (/\b(analy|research|data|report|evaluat)\b/.test(lc)) verb = pickVerb('analyze');
    else if (/\b(collab|partner|cross.?func|with)\b/.test(lc)) verb = pickVerb('collab');
    else if (/\b(launch|start|creat|new|initiat|found)\b/.test(lc)) verb = pickVerb('create');
    else verb = pickVerb('dev');

    // Capitalize first letter after verb
    text = text.charAt(0).toLowerCase() + text.slice(1);
    text = `${verb} ${text}`;
  }

  // Ensure ends with period
  if (!/[.!]$/.test(text)) text += '.';

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);

  return text;
}

// ─── PROJECT ENHANCER ────────────────────────────────────────
function enhanceProjectDetails(rawDetails) {
  const lines = rawDetails.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: '', bullets: [] };

  // Try to parse: first segment before — or - is title, rest is description
  let title = lines[0];
  let descLines = lines.slice(1);

  // If single line with a dash separator, split it
  const dashSplit = title.match(/^(.+?)[\s]*[—–-][\s]*(.+)$/);
  if (dashSplit && descLines.length === 0) {
    title = dashSplit[1].trim();
    descLines = [dashSplit[2].trim()];
  }

  // Enhance title
  title = removeWeakLanguage(title);

  // Build enhanced bullets
  const bullets = [];

  if (descLines.length === 0) {
    // User gave minimal input — generate expanded bullets from title context
    bullets.push(enhanceBullet(`${pickVerb('dev')} a ${title.toLowerCase()} application utilizing modern technologies and best practices`));
    bullets.push(enhanceBullet(`${pickVerb('create')} intuitive user interfaces ensuring seamless user experience and accessibility`));
  } else {
    descLines.forEach(line => {
      // Split comma-separated items into separate bullets if they look like tech stack
      const techMatch = line.match(/^(tech|stack|built with|using|technologies?)[\s:]+(.+)/i);
      if (techMatch) {
        bullets.push(`<strong>Tech Stack:</strong> ${techMatch[2].trim()}`);
      } else {
        bullets.push(enhanceBullet(line));
      }
    });
  }

  return { title, bullets };
}

// ─── EXPERIENCE ENHANCER ─────────────────────────────────────
function enhanceExperienceDetails(rawDetails) {
  const lines = rawDetails.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { heading: '', bullets: [] };

  // Parse first line: Company — Role — Duration
  let heading = lines[0];
  let descLines = lines.slice(1);

  // Try to extract structured info
  const parts = heading.split(/[\s]*[—–|][\s]*/);
  if (parts.length >= 2) {
    const company = parts[0].trim();
    const role = parts[1]?.trim() || '';
    const duration = parts[2]?.trim() || '';
    heading = `<strong>${role || company}</strong>`;
    if (role && company) heading += ` — ${company}`;
    if (duration) heading += ` <span style="color:#6b7280;font-weight:normal;float:right">${duration}</span>`;
  }

  const bullets = [];

  if (descLines.length === 0) {
    // Minimal input — generate contextual bullets
    bullets.push(enhanceBullet(`Delivered key features and improvements, contributing to product reliability and user satisfaction`));
    bullets.push(enhanceBullet(`Collaborated with cross-functional teams to define requirements, design solutions, and ensure timely delivery`));
  } else {
    descLines.forEach(line => {
      bullets.push(enhanceBullet(line));
    });
  }

  return { heading, bullets };
}

// ─── SKILLS ENHANCER ─────────────────────────────────────────
function enhanceSkills(skills) {
  // Capitalize properly and deduplicate
  const seen = new Set();
  return skills
    .map(s => {
      let skill = s.trim();
      // Proper-case known acronyms
      const acronyms = { 'html': 'HTML', 'css': 'CSS', 'js': 'JavaScript', 'ts': 'TypeScript', 'sql': 'SQL', 'nosql': 'NoSQL', 'api': 'API', 'aws': 'AWS', 'gcp': 'GCP', 'ci/cd': 'CI/CD', 'ui': 'UI', 'ux': 'UX', 'ai': 'AI', 'ml': 'ML', 'oop': 'OOP', 'dsa': 'DSA', 'dbms': 'DBMS', 'os': 'OS', 'git': 'Git', 'github': 'GitHub', 'docker': 'Docker', 'kubernetes': 'Kubernetes', 'react': 'React', 'nodejs': 'Node.js', 'node.js': 'Node.js', 'expressjs': 'Express.js', 'express.js': 'Express.js', 'mongodb': 'MongoDB', 'postgresql': 'PostgreSQL', 'mysql': 'MySQL', 'python': 'Python', 'java': 'Java', 'c++': 'C++', 'c#': 'C#', 'php': 'PHP', 'ruby': 'Ruby', 'swift': 'Swift', 'kotlin': 'Kotlin', 'flutter': 'Flutter', 'django': 'Django', 'flask': 'Flask', 'springboot': 'Spring Boot', 'spring boot': 'Spring Boot', 'nextjs': 'Next.js', 'next.js': 'Next.js', 'vuejs': 'Vue.js', 'vue.js': 'Vue.js', 'angular': 'Angular', 'tailwind': 'Tailwind CSS', 'tailwindcss': 'Tailwind CSS', 'bootstrap': 'Bootstrap', 'firebase': 'Firebase', 'redis': 'Redis', 'graphql': 'GraphQL', 'rest': 'REST', 'figma': 'Figma', 'jira': 'Jira', 'agile': 'Agile', 'scrum': 'Scrum', 'linux': 'Linux', 'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch', 'pandas': 'Pandas', 'numpy': 'NumPy', 'opencv': 'OpenCV', 'tableau': 'Tableau', 'powerbi': 'Power BI', 'excel': 'Excel', 'vscode': 'VS Code', 'postman': 'Postman' };
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

// ─── EDUCATION ENHANCER ──────────────────────────────────────
function enhanceEducation(rawDetails) {
  let text = rawDetails.trim();
  // Try to parse: Degree, College, Year, CGPA
  const parts = text.split(/[,\n]/).map(s => s.trim()).filter(Boolean);

  let degree = parts[0] || text;
  let institution = parts[1] || '';
  let year = '';
  let grade = '';

  parts.forEach(p => {
    if (/\b(20\d{2})\b/.test(p) && !year) year = p.trim();
    else if (/\b(cgpa|gpa|percentage|%|\d\.\d)\b/i.test(p) && !grade) grade = p.trim();
  });

  // Remove year/grade from institution if they leaked in
  if (institution === year) institution = parts[2] || '';
  if (institution === grade) institution = parts[3] || '';

  let html = `<strong>${degree}</strong>`;
  if (institution) html += `<br/>${institution}`;
  const meta = [year, grade].filter(Boolean).join(' | ');
  if (meta) html += `<br/><span style="color:#6b7280;font-size:10pt;">${meta}</span>`;

  return html;
}

// ─── PROFESSIONAL SUMMARY GENERATOR ──────────────────────────
function generateSummary(data) {
  const { skills, userType, targetRole, experience, projects, education, internships } = data;
  const topSkills = enhanceSkills(skills.slice(0, 6)).join(', ');

  // Extract education context
  const eduText = education[0]?.details?.toLowerCase() || '';
  let fieldOfStudy = '';
  if (/computer/.test(eduText)) fieldOfStudy = 'Computer Science';
  else if (/electronics|ece/.test(eduText)) fieldOfStudy = 'Electronics and Communication Engineering';
  else if (/mechanical/.test(eduText)) fieldOfStudy = 'Mechanical Engineering';
  else if (/electrical|eee/.test(eduText)) fieldOfStudy = 'Electrical Engineering';
  else if (/information/.test(eduText)) fieldOfStudy = 'Information Technology';
  else if (/business|mba/.test(eduText)) fieldOfStudy = 'Business Administration';
  else if (/data/.test(eduText)) fieldOfStudy = 'Data Science';

  if (userType === 'Fresher') {
    const projCount = projects.length;
    const hasInternships = internships.length > 0;
    return `Motivated and detail-oriented ${fieldOfStudy || 'Engineering'} graduate with strong expertise in ${topSkills || 'modern technologies'}. ${projCount > 0 ? `Demonstrated practical skills through ${projCount} hands-on project${projCount > 1 ? 's' : ''} involving end-to-end development.` : ''} ${hasInternships ? 'Backed by real-world internship experience. ' : ''}Eager to leverage technical proficiency and problem-solving abilities in a ${targetRole || 'software development'} role to deliver impactful, scalable solutions.`;
  } else {
    const expCount = experience.length;
    return `Results-driven ${targetRole || 'technology professional'} with ${expCount >= 3 ? 'extensive' : 'proven'} industry experience in ${topSkills || 'cutting-edge technologies'}. Adept at delivering high-quality, scalable solutions, driving cross-functional collaboration, and achieving measurable business outcomes. Seeking to leverage deep technical expertise and leadership skills in a challenging ${targetRole || 'senior engineering'} role.`;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN: Generate enhanced resume HTML
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// Multiple Resume Template Generator
// CORE RULE: NEVER copy user input as-is. ALWAYS transform.
// ═══════════════════════════════════════════════════════════════

export function generateAllResumeTemplates(data) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements, targetRole, userType } = data;
  const summary = generateSummary(data);
  const enhancedSkills = enhanceSkills(skills);

  const templates = [
    generateMinimalATS(data, summary, enhancedSkills),
    generateCorporateBlue(data, summary, enhancedSkills),
    generateTwoColumn(data, summary, enhancedSkills),
    generateSidebarLeft(data, summary, enhancedSkills),
    generateSidebarRight(data, summary, enhancedSkills),
    generateDeveloperDark(data, summary, enhancedSkills),
    generateElegantSerif(data, summary, enhancedSkills),
    generateCompactOnePage(data, summary, enhancedSkills),
    generateCreativeDesigner(data, summary, enhancedSkills),
    generateTechFocused(data, summary, enhancedSkills)
  ];

  return { templates };
}

export function generateResumeHTML(data, templateType = 'minimal') {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements, targetRole, userType } = data;
  const summary = generateSummary(data);
  const enhancedSkills = enhanceSkills(skills);

  switch(templateType) {
    case 'corporate':
      return generateCorporateBlue(data, summary, enhancedSkills).html;
    case 'two-column':
      return generateTwoColumn(data, summary, enhancedSkills).html;
    case 'sidebar-left':
      return generateSidebarLeft(data, summary, enhancedSkills).html;
    case 'sidebar-right':
      return generateSidebarRight(data, summary, enhancedSkills).html;
    case 'developer-dark':
      return generateDeveloperDark(data, summary, enhancedSkills).html;
    case 'elegant-serif':
      return generateElegantSerif(data, summary, enhancedSkills).html;
    case 'compact':
      return generateCompactOnePage(data, summary, enhancedSkills).html;
    case 'creative':
      return generateCreativeDesigner(data, summary, enhancedSkills).html;
    case 'tech':
      return generateTechFocused(data, summary, enhancedSkills).html;
    default:
      return generateMinimalATS(data, summary, enhancedSkills).html;
  }
}

// ─── TEMPLATE 1: MINIMAL ATS (Single Column, Black & White) ─────────────────────────────
function generateMinimalATS(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  
  // Header - Clean and simple
  html += `<div class="resume-header">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="contact-info">`;
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  html += contactParts.join(' | ');
  html += `</div></div>`;
  
  // Summary
  html += `<section class="summary"><h2>Professional Summary</h2><p>${summary}</p></section>`;
  
  // Skills
  if (enhancedSkills.length > 0) {
    html += `<section class="skills"><h2>Technical Skills</h2><p>${enhancedSkills.join(' • ')}</p></section>`;
  }
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="experience"><h2>Professional Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="job">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Internships
  if (internships.length > 0) {
    html += `<section class="internships"><h2>Internship Experience</h2>`;
    internships.forEach(intern => {
      const enhanced = enhanceExperienceDetails(intern.details);
      html += `<div class="job">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="projects"><h2>Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="project">`;
      html += `<h3>${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Education
  if (education.length > 0 && education[0].details) {
    html += `<section class="education"><h2>Education</h2>`;
    education.forEach(edu => {
      html += `<p>${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  // Certifications
  if (certifications.length > 0) {
    html += `<section class="certifications"><h2>Certifications</h2><ul>`;
    certifications.forEach(cert => {
      html += `<li>${cert.trim()}</li>`;
    });
    html += `</ul></section>`;
  }
  
  // Achievements
  if (achievements.length > 0) {
    html += `<section class="achievements"><h2>Achievements</h2><ul>`;
    achievements.forEach(ach => {
      html += `<li>${enhanceBullet(ach)}</li>`;
    });
    html += `</ul></section>`;
  }
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; line-height: 1.4; color: #000; max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
    h1 { font-size: 18pt; font-weight: bold; margin-bottom: 4pt; }
    h2 { font-size: 14pt; font-weight: bold; margin: 16pt 0 8pt 0; text-transform: uppercase; letter-spacing: 1px; }
    h3 { font-size: 12pt; font-weight: bold; margin-bottom: 4pt; }
    .contact-info { font-size: 10pt; margin-bottom: 16pt; color: #333; }
    p { font-size: 10pt; margin-bottom: 8pt; }
    ul { margin-bottom: 12pt; padding-left: 20pt; }
    li { font-size: 10pt; margin-bottom: 4pt; }
    section { margin-bottom: 20pt; }
    .job, .project { margin-bottom: 12pt; }
    @media print { body { padding: 0; } }
    </style>
  `;
  
  return {
    name: "Minimal ATS",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 2: CORPORATE BLUE (Professional with Accent Color) ───────────────────────────
function generateCorporateBlue(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  
  // Header with blue accent
  html += `<header class="corporate-header">`;
  html += `<div class="header-top"></div>`;
  html += `<div class="header-content">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="contact-bar">`;
  const contactParts = [];
  if (personalInfo.email) contactParts.push(`<span class="contact-item">📧 ${personalInfo.email}</span>`);
  if (personalInfo.phone) contactParts.push(`<span class="contact-item">📱 ${personalInfo.phone}</span>`);
  if (personalInfo.location) contactParts.push(`<span class="contact-item">📍 ${personalInfo.location}</span>`);
  if (personalInfo.linkedin) contactParts.push(`<span class="contact-item">💼 ${personalInfo.linkedin}</span>`);
  html += contactParts.join(' | ');
  html += `</div></div></header>`;
  
  // Summary
  html += `<section class="corporate-summary"><h2>Professional Summary</h2><p>${summary}</p></section>`;
  
  // Skills with badges
  if (enhancedSkills.length > 0) {
    html += `<section class="corporate-skills"><h2>Core Competencies</h2><div class="skills-grid">`;
    enhancedSkills.forEach(skill => {
      html += `<span class="skill-badge">${skill}</span>`;
    });
    html += `</div></section>`;
  }
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="corporate-experience"><h2>Professional Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="corporate-job">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Other sections (similar structure)
  if (internships.length > 0) {
    html += `<section class="corporate-section"><h2>Internship Experience</h2>`;
    internships.forEach(intern => {
      const enhanced = enhanceExperienceDetails(intern.details);
      html += `<div class="corporate-job">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  if (projects.length > 0) {
    html += `<section class="corporate-section"><h2>Key Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="corporate-project">`;
      html += `<h3>${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  if (education.length > 0 && education[0].details) {
    html += `<section class="corporate-section"><h2>Education</h2>`;
    education.forEach(edu => {
      html += `<p class="education-item">${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  if (certifications.length > 0) {
    html += `<section class="corporate-section"><h2>Certifications</h2><ul>`;
    certifications.forEach(cert => {
      html += `<li>${cert.trim()}</li>`;
    });
    html += `</ul></section>`;
  }
  
  if (achievements.length > 0) {
    html += `<section class="corporate-section"><h2>Achievements</h2><ul>`;
    achievements.forEach(ach => {
      html += `<li>${enhanceBullet(ach)}</li>`;
    });
    html += `</ul></section>`;
  }
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.5; color: #333; max-width: 8.5in; margin: 0 auto; padding: 0; background: #fff; }
    .corporate-header { position: relative; margin-bottom: 30px; }
    .header-top { height: 8px; background: linear-gradient(90deg, #1e40af, #3b82f6); }
    .header-content { padding: 30px 40px; background: #f8fafc; border-left: 4px solid #1e40af; }
    h1 { font-size: 24pt; font-weight: 600; color: #1e40af; margin-bottom: 12px; }
    .contact-bar { font-size: 10pt; color: #64748b; }
    .contact-item { margin: 0 8px; }
    .corporate-summary { margin-bottom: 25px; padding: 0 40px; }
    .corporate-section { margin-bottom: 25px; padding: 0 40px; }
    h2 { font-size: 16pt; font-weight: 600; color: #1e40af; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
    h3 { font-size: 13pt; font-weight: 600; color: #334155; margin-bottom: 8px; }
    p { font-size: 11pt; margin-bottom: 10px; }
    .corporate-skills { margin-bottom: 25px; padding: 0 40px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-badge { background: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 20px; font-size: 9pt; font-weight: 500; }
    .corporate-job, .corporate-project { margin-bottom: 20px; padding-left: 20px; border-left: 3px solid #3b82f6; }
    .education-item { margin-bottom: 8px; padding-left: 20px; }
    ul { padding-left: 20px; margin-bottom: 10px; }
    li { font-size: 10pt; margin-bottom: 6px; color: #475569; }
    @media print { body { padding: 0; } .corporate-header { page-break-inside: avoid; } }
    </style>
  `;
  
  return {
    name: "Corporate Blue",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 3: TWO COLUMN LAYOUT ───────────────────────────────────────────────
function generateTwoColumn(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="two-column-container">`;
  
  // Left Column
  html += `<div class="left-column">`;
  
  // Header
  html += `<header class="two-col-header">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="contact-info">`;
  if (personalInfo.email) html += `<p>📧 ${personalInfo.email}</p>`;
  if (personalInfo.phone) html += `<p>📱 ${personalInfo.phone}</p>`;
  if (personalInfo.location) html += `<p>📍 ${personalInfo.location}</p>`;
  if (personalInfo.linkedin) html += `<p>💼 ${personalInfo.linkedin}</p>`;
  html += `</div></header>`;
  
  // Summary
  html += `<section class="two-col-summary"><h2>Summary</h2><p>${summary}</p></section>`;
  
  // Skills
  if (enhancedSkills.length > 0) {
    html += `<section class="two-col-skills"><h2>Skills</h2><div class="skill-list">`;
    enhancedSkills.forEach(skill => {
      html += `<div class="skill-item">• ${skill}</div>`;
    });
    html += `</div></section>`;
  }
  
  // Education
  if (education.length > 0 && education[0].details) {
    html += `<section class="two-col-education"><h2>Education</h2>`;
    education.forEach(edu => {
      html += `<p>${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  
  // Right Column
  html += `<div class="right-column">`;
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="two-col-experience"><h2>Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="experience-item">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="two-col-projects"><h2>Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="project-item">`;
      html += `<h3>${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #333; max-width: 8.5in; margin: 0 auto; padding: 0.25in; }
    .two-column-container { display: flex; gap: 30px; min-height: 11in; }
    .left-column { flex: 0.4; padding-right: 20px; border-right: 2px solid #e5e7eb; }
    .right-column { flex: 0.6; }
    .two-col-header { margin-bottom: 20px; }
    h1 { font-size: 20pt; font-weight: bold; color: #1f2937; margin-bottom: 12px; }
    .contact-info p { font-size: 9pt; margin-bottom: 4px; color: #6b7280; }
    .two-col-summary, .two-col-skills, .two-col-education, .two-col-experience, .two-col-projects { margin-bottom: 20px; }
    h2 { font-size: 12pt; font-weight: bold; color: #374151; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #d1d5db; padding-bottom: 3px; }
    h3 { font-size: 11pt; font-weight: bold; color: #4b5563; margin-bottom: 6px; }
    p { font-size: 9pt; margin-bottom: 8px; }
    .skill-item { font-size: 9pt; margin-bottom: 3px; color: #4b5563; }
    .experience-item, .project-item { margin-bottom: 15px; }
    ul { padding-left: 15px; margin-bottom: 8px; }
    li { font-size: 9pt; margin-bottom: 3px; }
    @media print { .two-column-container { gap: 20px; } }
    </style>
  `;
  
  return {
    name: "Two Column Layout",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 4: SIDEBAR LEFT MODERN ─────────────────────────────────────────────
function generateSidebarLeft(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="sidebar-container">`;
  
  // Left Sidebar
  html += `<aside class="sidebar-left">`;
  html += `<div class="sidebar-header">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="sidebar-contact">`;
  if (personalInfo.email) html += `<p>${personalInfo.email}</p>`;
  if (personalInfo.phone) html += `<p>${personalInfo.phone}</p>`;
  if (personalInfo.location) html += `<p>${personalInfo.location}</p>`;
  if (personalInfo.linkedin) html += `<p>${personalInfo.linkedin}</p>`;
  html += `</div></div>`;
  
  // Skills in sidebar
  if (enhancedSkills.length > 0) {
    html += `<section class="sidebar-skills"><h3>Skills</h3>`;
    enhancedSkills.forEach(skill => {
      html += `<div class="sidebar-skill">• ${skill}</div>`;
    });
    html += `</section>`;
  }
  
  // Education in sidebar
  if (education.length > 0 && education[0].details) {
    html += `<section class="sidebar-education"><h3>Education</h3>`;
    education.forEach(edu => {
      html += `<p>${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  html += `</aside>`;
  
  // Main Content
  html += `<main class="main-content">`;
  
  // Summary
  html += `<section class="main-summary"><h2>Professional Summary</h2><p>${summary}</p></section>`;
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="main-experience"><h2>Professional Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="main-job">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="main-projects"><h2>Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="main-project">`;
      html += `<h3>${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</main>`;
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; max-width: 8.5in; margin: 0 auto; padding: 0.25in; background: #f9fafb; }
    .sidebar-container { display: flex; gap: 0; min-height: 11in; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .sidebar-left { flex: 0.35; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; }
    .sidebar-header h1 { font-size: 18pt; font-weight: bold; margin-bottom: 20px; color: white; }
    .sidebar-contact p { font-size: 9pt; margin-bottom: 8px; opacity: 0.9; }
    .sidebar-skills, .sidebar-education { margin-bottom: 25px; }
    .sidebar-skills h3, .sidebar-education h3 { font-size: 11pt; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .sidebar-skill { font-size: 9pt; margin-bottom: 5px; opacity: 0.9; }
    .main-content { flex: 0.65; padding: 30px; }
    .main-summary, .main-experience, .main-projects { margin-bottom: 25px; }
    h2 { font-size: 16pt; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
    h3 { font-size: 12pt; font-weight: bold; color: #4b5563; margin-bottom: 8px; }
    p { font-size: 10pt; margin-bottom: 10px; color: #374151; }
    .main-job, .main-project { margin-bottom: 20px; padding-left: 15px; border-left: 3px solid #667eea; }
    ul { padding-left: 20px; margin-bottom: 10px; }
    li { font-size: 10pt; margin-bottom: 5px; color: #4b5563; }
    @media print { body { background: white; } .sidebar-container { box-shadow: none; } }
    </style>
  `;
  
  return {
    name: "Sidebar Left Modern",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 5: SIDEBAR RIGHT MODERN ────────────────────────────────────────────
function generateSidebarRight(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="sidebar-right-container">`;
  
  // Main Content
  html += `<main class="main-right-content">`;
  
  // Header
  html += `<header class="right-header">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="right-contact">`;
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  html += contactParts.join(' • ');
  html += `</div></header>`;
  
  // Summary
  html += `<section class="right-summary"><h2>Professional Summary</h2><p>${summary}</p></section>`;
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="right-experience"><h2>Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="right-job">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="right-projects"><h2>Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="right-project">`;
      html += `<h3>${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</main>`;
  
  // Right Sidebar
  html += `<aside class="sidebar-right">`;
  
  // Skills
  if (enhancedSkills.length > 0) {
    html += `<section class="right-skills"><h3>Technical Skills</h3>`;
    enhancedSkills.forEach(skill => {
      html += `<div class="right-skill-item">${skill}</div>`;
    });
    html += `</section>`;
  }
  
  // Education
  if (education.length > 0 && education[0].details) {
    html += `<section class="right-education"><h3>Education</h3>`;
    education.forEach(edu => {
      html += `<p>${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  // LinkedIn
  if (personalInfo.linkedin) {
    html += `<section class="right-linkedin"><h3>LinkedIn</h3><p>${personalInfo.linkedin}</p></section>`;
  }
  
  html += `</aside>`;
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; max-width: 8.5in; margin: 0 auto; padding: 0.25in; background: #f8f9fa; }
    .sidebar-right-container { display: flex; gap: 0; min-height: 11in; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .main-right-content { flex: 0.65; padding: 40px 30px 40px 40px; }
    .sidebar-right { flex: 0.35; background: #2c3e50; color: white; padding: 40px 30px; }
    .right-header h1 { font-size: 22pt; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
    .right-contact { font-size: 10pt; color: #7f8c8d; margin-bottom: 25px; }
    .right-summary, .right-experience, .right-projects { margin-bottom: 25px; }
    h2 { font-size: 15pt; font-weight: bold; color: #2c3e50; margin-bottom: 12px; border-left: 4px solid #3498db; padding-left: 10px; }
    h3 { font-size: 11pt; font-weight: bold; margin-bottom: 8px; }
    p { font-size: 10pt; margin-bottom: 8px; color: #34495e; }
    .right-job, .right-project { margin-bottom: 18px; }
    ul { padding-left: 18px; margin-bottom: 8px; }
    li { font-size: 10pt; margin-bottom: 4px; color: #5a6c7d; }
    .right-skills, .right-education, .right-linkedin { margin-bottom: 25px; }
    .right-skills h3, .right-education h3, .right-linkedin h3 { font-size: 11pt; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; color: #ecf0f1; }
    .right-skill-item { background: #34495e; padding: 8px 12px; margin-bottom: 6px; border-radius: 4px; font-size: 9pt; }
    .right-education p, .right-linkedin p { font-size: 9pt; color: #bdc3c7; line-height: 1.4; }
    @media print { body { background: white; } .sidebar-right-container { box-shadow: none; } }
    </style>
  `;
  
  return {
    name: "Sidebar Right Modern",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 6: DEVELOPER DARK THEME ────────────────────────────────────────────
function generateDeveloperDark(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="dev-dark-container">`;
  
  // Header
  html += `<header class="dev-header">`;
  html += `<div class="dev-header-bg"></div>`;
  html += `<div class="dev-header-content">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="dev-contact">`;
  if (personalInfo.email) html += `<span class="dev-contact-item">&lt;${personalInfo.email}&gt;</span>`;
  if (personalInfo.phone) html += `<span class="dev-contact-item">[${personalInfo.phone}]</span>`;
  if (personalInfo.location) html += `<span class="dev-contact-item">{${personalInfo.location}}</span>`;
  if (personalInfo.linkedin) html += `<span class="dev-contact-item">// ${personalInfo.linkedin}</span>`;
  html += `</div></div></header>`;
  
  // Summary
  html += `<section class="dev-summary"><h2 class="dev-section-title">&gt; About</h2><p>${summary}</p></section>`;
  
  // Skills as code blocks
  if (enhancedSkills.length > 0) {
    html += `<section class="dev-skills"><h2 class="dev-section-title">&gt; Tech Stack</h2><div class="dev-code-block">`;
    html += `<pre><code>const skills = [${enhancedSkills.map(skill => `'${skill}'`).join(', ')}];</code></pre>`;
    html += `</div></section>`;
  }
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="dev-experience"><h2 class="dev-section-title">&gt; Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="dev-job">`;
      html += `<h3 class="dev-job-title">${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="dev-bullets">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="dev-projects"><h2 class="dev-section-title">&gt; Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="dev-project">`;
      html += `<h3 class="dev-project-title">// ${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="dev-bullets">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Fira Code', 'Courier New', monospace; line-height: 1.6; color: #e2e8f0; max-width: 8.5in; margin: 0 auto; padding: 0; background: #0f172a; }
    .dev-dark-container { background: #1e293b; min-height: 11in; }
    .dev-header { position: relative; margin-bottom: 30px; overflow: hidden; }
    .dev-header-bg { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); height: 120px; }
    .dev-header-content { position: relative; padding: 30px 40px; background: #1e293b; margin-top: -40px; border-left: 4px solid #0ea5e9; }
    .dev-header h1 { font-size: 24pt; font-weight: 600; color: #f1f5f9; margin-bottom: 15px; }
    .dev-contact { display: flex; flex-wrap: wrap; gap: 15px; }
    .dev-contact-item { font-size: 9pt; color: #94a3b8; background: #334155; padding: 4px 8px; border-radius: 3px; }
    .dev-summary, .dev-skills, .dev-experience, .dev-projects { margin-bottom: 25px; padding: 0 40px; }
    .dev-section-title { font-size: 14pt; font-weight: 600; color: #0ea5e9; margin-bottom: 15px; font-family: 'Fira Code', monospace; }
    .dev-job-title, .dev-project-title { font-size: 12pt; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
    p { font-size: 10pt; margin-bottom: 10px; color: #cbd5e1; }
    .dev-code-block { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 15px; margin-bottom: 10px; }
    .dev-code-block pre { margin: 0; font-size: 9pt; color: #10b981; }
    .dev-job, .dev-project { margin-bottom: 20px; padding-left: 15px; border-left: 2px solid #6366f1; }
    .dev-bullets { padding-left: 20px; margin-bottom: 10px; }
    .dev-bullets li { font-size: 10pt; margin-bottom: 5px; color: #94a3b8; }
    @media print { body { background: white; color: black; } .dev-dark-container { background: white; } }
    </style>
  `;
  
  return {
    name: "Developer Dark Theme",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 7: ELEGANT SERIF ───────────────────────────────────────────────────
function generateElegantSerif(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="elegant-container">`;
  
  // Header
  html += `<header class="elegant-header">`;
  html += `<div class="elegant-name">${personalInfo.fullName}</div>`;
  html += `<div class="elegant-divider"></div>`;
  html += `<div class="elegant-contact">`;
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  html += contactParts.join(' • ');
  html += `</div></header>`;
  
  // Summary
  html += `<section class="elegant-summary"><h2 class="elegant-heading">Professional Summary</h2><p>${summary}</p></section>`;
  
  // Skills
  if (enhancedSkills.length > 0) {
    html += `<section class="elegant-skills"><h2 class="elegant-heading">Core Competencies</h2><p class="elegant-skills-text">${enhancedSkills.join(' • ')}</p></section>`;
  }
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="elegant-experience"><h2 class="elegant-heading">Professional Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="elegant-job">`;
      html += `<h3 class="elegant-job-title">${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="elegant-list">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="elegant-projects"><h2 class="elegant-heading">Selected Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="elegant-project">`;
      html += `<h3 class="elegant-project-title">${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="elegant-list">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Education
  if (education.length > 0 && education[0].details) {
    html += `<section class="elegant-education"><h2 class="elegant-heading">Education</h2>`;
    education.forEach(edu => {
      html += `<p class="elegant-edu-text">${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7; color: #2c3e50; max-width: 8.5in; margin: 0 auto; padding: 0.75in; background: #fafafa; }
    .elegant-container { background: white; padding: 60px; min-height: 11in; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .elegant-header { text-align: center; margin-bottom: 40px; }
    .elegant-name { font-size: 32pt; font-weight: 300; color: #1a1a1a; letter-spacing: 2px; margin-bottom: 15px; }
    .elegant-divider { width: 80px; height: 2px; background: #c9302c; margin: 0 auto 20px; }
    .elegant-contact { font-size: 11pt; color: #7f8c8d; font-style: italic; }
    .elegant-summary, .elegant-skills, .elegant-experience, .elegant-projects, .elegant-education { margin-bottom: 35px; }
    .elegant-heading { font-size: 16pt; font-weight: 600; color: #1a1a1a; margin-bottom: 15px; text-align: center; position: relative; }
    .elegant-heading::after { content: ''; display: block; width: 50px; height: 1px; background: #c9302c; margin: 8px auto 0; }
    .elegant-job-title, .elegant-project-title { font-size: 13pt; font-weight: 600; color: #2c3e50; margin-bottom: 10px; }
    p { font-size: 11pt; margin-bottom: 12px; text-align: justify; }
    .elegant-skills-text { font-size: 11pt; text-align: center; color: #34495e; }
    .elegant-job, .elegant-project { margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-left: 3px solid #c9302c; }
    .elegant-list { padding-left: 20px; margin-bottom: 10px; }
    .elegant-list li { font-size: 10pt; margin-bottom: 6px; color: #34495e; }
    .elegant-edu-text { font-size: 11pt; text-align: center; font-style: italic; color: #2c3e50; }
    @media print { body { background: white; } .elegant-container { box-shadow: none; padding: 40px; } }
    </style>
  `;
  
  return {
    name: "Elegant Serif",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 8: COMPACT ONE PAGE ───────────────────────────────────────────────
function generateCompactOnePage(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="compact-container">`;
  
  // Header
  html += `<header class="compact-header">`;
  html += `<div class="compact-name">${personalInfo.fullName}</div>`;
  html += `<div class="compact-contact">`;
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  html += contactParts.join(' | ');
  html += `</div></header>`;
  
  // Two column layout for compactness
  html += `<div class="compact-grid">`;
  
  // Left column
  html += `<div class="compact-left">`;
  
  // Summary
  html += `<section class="compact-section"><h3>Summary</h3><p>${summary}</p></section>`;
  
  // Skills
  if (enhancedSkills.length > 0) {
    html += `<section class="compact-section"><h3>Skills</h3><div class="compact-skills">`;
    enhancedSkills.forEach(skill => {
      html += `<span class="compact-skill">${skill}</span>`;
    });
    html += `</div></section>`;
  }
  
  // Education
  if (education.length > 0 && education[0].details) {
    html += `<section class="compact-section"><h3>Education</h3>`;
    education.forEach(edu => {
      html += `<p>${enhanceEducation(edu.details)}</p>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  
  // Right column
  html += `<div class="compact-right">`;
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="compact-section"><h3>Experience</h3>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="compact-job">`;
      html += `<h4>${enhanced.heading}</h4>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="compact-section"><h3>Projects</h3>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="compact-project">`;
      html += `<h4>${enhanced.title}</h4>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul>`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  html += `</div>`;
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.3; color: #333; max-width: 8.5in; margin: 0 auto; padding: 0.25in; }
    .compact-container { padding: 20px; min-height: 11in; }
    .compact-header { margin-bottom: 20px; text-align: center; }
    .compact-name { font-size: 20pt; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
    .compact-contact { font-size: 9pt; color: #6b7280; }
    .compact-grid { display: flex; gap: 20px; }
    .compact-left, .compact-right { flex: 1; }
    .compact-section { margin-bottom: 15px; }
    h3 { font-size: 11pt; font-weight: bold; color: #374151; margin-bottom: 8px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 2px; }
    h4 { font-size: 10pt; font-weight: bold; color: #4b5563; margin-bottom: 4px; }
    p { font-size: 9pt; margin-bottom: 6px; }
    .compact-skills { display: flex; flex-wrap: wrap; gap: 4px; }
    .compact-skill { background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 3px; font-size: 8pt; }
    .compact-job, .compact-project { margin-bottom: 10px; }
    ul { padding-left: 12px; margin-bottom: 6px; }
    li { font-size: 8pt; margin-bottom: 2px; }
    @media print { .compact-grid { gap: 15px; } }
    </style>
  `;
  
  return {
    name: "Compact One Page",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 9: CREATIVE DESIGNER LAYOUT ────────────────────────────────────────
function generateCreativeDesigner(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="creative-container">`;
  
  // Header with creative design
  html += `<header class="creative-header">`;
  html += `<div class="creative-pattern"></div>`;
  html += `<div class="creative-header-content">`;
  html += `<div class="creative-name-plate">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="creative-title">Creative Professional</div>`;
  html += `</div>`;
  html += `<div class="creative-contact-info">`;
  if (personalInfo.email) html += `<div class="creative-contact">📧 ${personalInfo.email}</div>`;
  if (personalInfo.phone) html += `<div class="creative-contact">📱 ${personalInfo.phone}</div>`;
  if (personalInfo.location) html += `<div class="creative-contact">📍 ${personalInfo.location}</div>`;
  if (personalInfo.linkedin) html += `<div class="creative-contact">💼 ${personalInfo.linkedin}</div>`;
  html += `</div></div></header>`;
  
  // Summary with creative styling
  html += `<section class="creative-summary"><h2 class="creative-heading">✨ About Me</h2><div class="creative-summary-box"><p>${summary}</p></div></section>`;
  
  // Skills with creative badges
  if (enhancedSkills.length > 0) {
    html += `<section class="creative-skills"><h2 class="creative-heading">🎨 Creative Toolkit</h2><div class="creative-skills-grid">`;
    enhancedSkills.forEach(skill => {
      html += `<div class="creative-skill-card">${skill}</div>`;
    });
    html += `</div></section>`;
  }
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="creative-experience"><h2 class="creative-heading">💼 Professional Journey</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="creative-job-card">`;
      html += `<h3>${enhanced.heading}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="creative-list">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="creative-projects"><h2 class="creative-heading">🚀 Featured Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="creative-project-card">`;
      html += `<h3>${enhanced.title}</h3>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="creative-list">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', 'Arial', sans-serif; line-height: 1.6; color: #2d3748; max-width: 8.5in; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .creative-container { background: white; margin: 0.25in; border-radius: 15px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .creative-header { position: relative; margin-bottom: 30px; }
    .creative-pattern { height: 150px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4); background-size: 400% 400%; animation: gradient 15s ease infinite; }
    @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    .creative-header-content { display: flex; justify-content: space-between; align-items: center; padding: 30px 40px; background: white; margin-top: -50px; margin-left: 40px; margin-right: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .creative-name-plate h1 { font-size: 24pt; font-weight: 700; color: #2d3748; margin-bottom: 5px; }
    .creative-title { font-size: 12pt; color: #718096; font-weight: 500; }
    .creative-contact-info { text-align: right; }
    .creative-contact { font-size: 9pt; color: #4a5568; margin-bottom: 3px; }
    .creative-summary, .creative-skills, .creative-experience, .creative-projects { margin-bottom: 30px; padding: 0 40px; }
    .creative-heading { font-size: 16pt; font-weight: 600; color: #2d3748; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    .creative-summary-box { background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 20px; border-radius: 10px; margin-bottom: 15px; }
    .creative-skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; }
    .creative-skill-card { background: linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%); padding: 12px; border-radius: 8px; text-align: center; font-size: 10pt; font-weight: 500; color: #2d3748; }
    .creative-job-card, .creative-project-card { background: #f7fafc; border-left: 4px solid #4ecdc4; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
    .creative-job-card h3, .creative-project-card h3 { font-size: 13pt; font-weight: 600; color: #2d3748; margin-bottom: 10px; }
    .creative-list { padding-left: 20px; margin-bottom: 10px; }
    .creative-list li { font-size: 10pt; margin-bottom: 5px; color: #4a5568; }
    @media print { body { background: white; } .creative-container { box-shadow: none; border-radius: 0; margin: 0; } .creative-pattern { background: #4ecdc4; } }
    </style>
  `;
  
  return {
    name: "Creative Designer Layout",
    html: style + html,
    style: style
  };
}

// ─── TEMPLATE 10: TECH-FOCUSED RESUME ───────────────────────────────────────────
function generateTechFocused(data, summary, enhancedSkills) {
  const { personalInfo, education, skills, projects, experience, internships, certifications, achievements } = data;
  
  let html = '';
  html += `<div class="tech-container">`;
  
  // Header
  html += `<header class="tech-header">`;
  html += `<div class="tech-header-bar"></div>`;
  html += `<div class="tech-header-content">`;
  html += `<h1>${personalInfo.fullName}</h1>`;
  html += `<div class="tech-subtitle">Full Stack Developer | Problem Solver</div>`;
  html += `<div class="tech-contact">`;
  if (personalInfo.email) html += `<span class="tech-contact-item">${personalInfo.email}</span>`;
  if (personalInfo.phone) html += `<span class="tech-contact-item">${personalInfo.phone}</span>`;
  if (personalInfo.location) html += `<span class="tech-contact-item">${personalInfo.location}</span>`;
  if (personalInfo.linkedin) html += `<span class="tech-contact-item">${personalInfo.linkedin}</span>`;
  html += `</div></div></header>`;
  
  // Summary
  html += `<section class="tech-summary"><h2 class="tech-section-title">// Executive Summary</h2><div class="tech-code-block"><p>${summary}</p></div></section>`;
  
  // Technical Skills
  if (enhancedSkills.length > 0) {
    html += `<section class="tech-skills"><h2 class="tech-section-title">// Technical Arsenal</h2>`;
    // Categorize skills
    const frontendSkills = enhancedSkills.filter(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('vue') || s.toLowerCase().includes('angular') || s.toLowerCase().includes('html') || s.toLowerCase().includes('css') || s.toLowerCase().includes('javascript'));
    const backendSkills = enhancedSkills.filter(s => s.toLowerCase().includes('node') || s.toLowerCase().includes('python') || s.toLowerCase().includes('java') || s.toLowerCase().includes('spring') || s.toLowerCase().includes('django'));
    const databaseSkills = enhancedSkills.filter(s => s.toLowerCase().includes('sql') || s.toLowerCase().includes('mongodb') || s.toLowerCase().includes('postgres') || s.toLowerCase().includes('mysql'));
    const cloudSkills = enhancedSkills.filter(s => s.toLowerCase().includes('aws') || s.toLowerCase().includes('azure') || s.toLowerCase().includes('docker') || s.toLowerCase().includes('kubernetes'));
    
    if (frontendSkills.length > 0) {
      html += `<div class="tech-skill-category"><h3>Frontend</h3><div class="tech-skill-list">${frontendSkills.join(' • ')}</div></div>`;
    }
    if (backendSkills.length > 0) {
      html += `<div class="tech-skill-category"><h3>Backend</h3><div class="tech-skill-list">${backendSkills.join(' • ')}</div></div>`;
    }
    if (databaseSkills.length > 0) {
      html += `<div class="tech-skill-category"><h3>Database</h3><div class="tech-skill-list">${databaseSkills.join(' • ')}</div></div>`;
    }
    if (cloudSkills.length > 0) {
      html += `<div class="tech-skill-category"><h3>Cloud & DevOps</h3><div class="tech-skill-list">${cloudSkills.join(' • ')}</div></div>`;
    }
    
    html += `</section>`;
  }
  
  // Experience
  if (experience.length > 0) {
    html += `<section class="tech-experience"><h2 class="tech-section-title">// Professional Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `<div class="tech-job">`;
      html += `<div class="tech-job-header">`;
      html += `<h3>${enhanced.heading}</h3>`;
      html += `</div>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="tech-bullets">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  // Projects
  if (projects.length > 0) {
    html += `<section class="tech-projects"><h2 class="tech-section-title">// Technical Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `<div class="tech-project">`;
      html += `<div class="tech-project-header">`;
      html += `<h3>${enhanced.title}</h3>`;
      html += `</div>`;
      if (enhanced.bullets.length > 0) {
        html += `<ul class="tech-bullets">`;
        enhanced.bullets.forEach(b => { html += `<li>${b}</li>`; });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</section>`;
  }
  
  html += `</div>`;
  
  const style = `
    <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Consolas', 'Monaco', monospace; line-height: 1.5; color: #e2e8f0; max-width: 8.5in; margin: 0 auto; padding: 0; background: #0f172a; }
    .tech-container { background: #1e293b; min-height: 11in; }
    .tech-header { position: relative; margin-bottom: 30px; }
    .tech-header-bar { height: 6px; background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6); }
    .tech-header-content { padding: 40px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-left: 4px solid #10b981; }
    .tech-header h1 { font-size: 26pt; font-weight: 600; color: #10b981; margin-bottom: 8px; font-family: 'Consolas', monospace; }
    .tech-subtitle { font-size: 12pt; color: #94a3b8; margin-bottom: 15px; }
    .tech-contact { display: flex; flex-wrap: wrap; gap: 20px; }
    .tech-contact-item { font-size: 9pt; color: #cbd5e1; background: #0f172a; padding: 6px 12px; border-radius: 4px; border: 1px solid #334155; }
    .tech-summary, .tech-skills, .tech-experience, .tech-projects { margin-bottom: 30px; padding: 0 40px; }
    .tech-section-title { font-size: 14pt; font-weight: 600; color: #10b981; margin-bottom: 15px; font-family: 'Consolas', monospace; }
    .tech-code-block { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 20px; margin-bottom: 15px; }
    .tech-code-block p { font-size: 10pt; color: #e2e8f0; margin: 0; }
    .tech-skill-category { margin-bottom: 15px; }
    .tech-skill-category h3 { font-size: 11pt; font-weight: 600; color: #3b82f6; margin-bottom: 8px; }
    .tech-skill-list { font-size: 10pt; color: #94a3b8; padding-left: 15px; }
    .tech-job, .tech-project { margin-bottom: 25px; background: #0f172a; border-radius: 6px; overflow: hidden; }
    .tech-job-header, .tech-project-header { background: #334155; padding: 12px 20px; border-left: 4px solid #10b981; }
    .tech-job-header h3, .tech-project-header h3 { font-size: 12pt; font-weight: 600; color: #10b981; }
    .tech-job > ul, .tech-project > ul { padding: 20px; margin: 0; }
    .tech-bullets { padding-left: 20px; margin: 0; }
    .tech-bullets li { font-size: 10pt; margin-bottom: 6px; color: #cbd5e1; }
    @media print { body { background: white; color: black; } .tech-container { background: white; } .tech-header { background: white; } }
    </style>
  `;
  
  return {
    name: "Tech-Focused Resume",
    html: style + html,
    style: style
  };
}

// ═══════════════════════════════════════════════════════════════
// ATS SCORE CALCULATOR
// ═══════════════════════════════════════════════════════════════
export function calculateATSScore(data) {
  let score = 0;
  const missing = [];
  const suggestions = [];
  const improvements = [];

  // ── Personal Info (20 pts) ──
  if (data.personalInfo.fullName) score += 5;
  else missing.push('Full Name');
  if (data.personalInfo.email) score += 5;
  else missing.push('Email');
  if (data.personalInfo.phone) score += 5;
  else missing.push('Phone');
  if (data.personalInfo.location) score += 3;
  else suggestions.push('Add your location — many ATS systems filter by geography.');
  if (data.personalInfo.linkedin) score += 2;
  else suggestions.push('Add a LinkedIn or GitHub profile link to increase credibility.');

  // ── Skills (15 pts) ──
  if (data.skills.length >= 10) score += 15;
  else if (data.skills.length >= 7) score += 12;
  else if (data.skills.length >= 5) score += 8;
  else if (data.skills.length >= 3) score += 5;
  else {
    suggestions.push('Add more technical skills (aim for 8–12) to maximize keyword matching.');
    improvements.push('Expand skills section with relevant tools, frameworks, and methodologies.');
  }

  // ── Experience / Internships (25 pts) ──
  if (data.userType === 'Experienced') {
    if (data.experience.length >= 3) score += 25;
    else if (data.experience.length >= 2) score += 20;
    else if (data.experience.length >= 1) score += 15;
    else {
      missing.push('Work Experience');
      improvements.push('Add work experience entries with quantified achievements and measurable impact.');
    }
  } else {
    if (data.internships.length >= 2) score += 18;
    else if (data.internships.length >= 1) score += 12;
    else suggestions.push('Consider adding internship experience — even short ones count.');
    if (data.projects.length >= 3) score += 7;
    else if (data.projects.length >= 2) score += 5;
    else improvements.push('Add more projects to showcase hands-on development skills.');
  }

  // ── Projects (15 pts) ──
  if (data.projects.length >= 4) score += 15;
  else if (data.projects.length >= 3) score += 12;
  else if (data.projects.length >= 2) score += 8;
  else if (data.projects.length >= 1) score += 5;
  else suggestions.push('Add at least 2 projects with title, description, and tech stack.');

  // ── Education (10 pts) ──
  if (data.education[0]?.details) score += 10;
  else missing.push('Education');

  // ── Certifications (5 pts) ──
  if (data.certifications.length >= 2) score += 5;
  else if (data.certifications.length >= 1) score += 3;
  else suggestions.push('Industry certifications (AWS, Google, etc.) can significantly boost ATS scores.');

  // ── Achievements (5 pts) ──
  if (data.achievements.length >= 2) score += 5;
  else if (data.achievements.length >= 1) score += 3;
  else suggestions.push('Achievements and awards add credibility — consider adding some.');

  // ── Target Role (5 pts) ──
  if (data.targetRole) score += 5;
  else missing.push('Target Role');

  score = Math.min(score, 100);

  return { score, missing, suggestions, improvements };
}

// ═══════════════════════════════════════════════════════════════
// JOB MATCHING ENGINE
// ═══════════════════════════════════════════════════════════════
export function matchJobDescription(data, jdText) {
  if (!jdText || jdText.trim() === '') return { matchPercentage: 0, missingSkills: [], improvements: [] };
  
  const jdLower = jdText.toLowerCase();
  
  // Combine all skills and keywords from the resume
  const resumeText = [
    ...data.skills,
    data.targetRole,
    ...data.projects.map(p => p.details),
    ...data.experience.map(e => e.details)
  ].join(' ').toLowerCase();

  // Extract potential skills from JD (simple heuristic matching known tech words)
  const commonTech = ['react', 'node.js', 'nodejs', 'python', 'java', 'c++', 'javascript', 'typescript', 'aws', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'agile', 'scrum', 'git', 'ci/cd', 'machine learning', 'ai', 'html', 'css', 'vue', 'angular', 'django', 'spring', 'flask', 'rest api', 'graphql', 'redux'];
  
  const requiredSkills = commonTech.filter(tech => jdLower.includes(tech));
  
  const foundSkills = [];
  const missingSkills = [];
  
  requiredSkills.forEach(skill => {
    // Check if the resume text contains the skill
    if (resumeText.includes(skill)) {
      foundSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate match percentage
  let matchPercentage = 0;
  if (requiredSkills.length > 0) {
    matchPercentage = Math.round((foundSkills.length / requiredSkills.length) * 100);
  } else {
    // Fallback if no specific tech skills found but some overlap exists
    const jdWords = new Set(jdLower.split(/\\s+/).filter(w => w.length > 4));
    let matchCount = 0;
    jdWords.forEach(word => {
      if (resumeText.includes(word)) matchCount++;
    });
    matchPercentage = Math.min(100, Math.round((matchCount / Math.max(jdWords.size, 1)) * 100));
    // Boost a bit for general overlap
    matchPercentage = Math.min(100, matchPercentage * 2);
  }

  const improvements = [];
  if (missingSkills.length > 0) {
    improvements.push(`Add these missing keywords to your skills or experience: ${missingSkills.slice(0, 5).join(', ')}.`);
  }
  if (matchPercentage < 50) {
    improvements.push('Your resume lacks significant alignment with this JD. Consider tailoring your project descriptions to highlight the required tech stack.');
  } else if (matchPercentage < 80) {
    improvements.push('Good match, but try to explicitly mention the missing tools in your bullet points to pass strict ATS filters.');
  } else {
    improvements.push('Excellent match! Your resume is highly aligned with this role.');
  }

  return { matchPercentage, missingSkills, improvements };
}

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO GENERATION
// ═══════════════════════════════════════════════════════════════
export function generatePortfolioHTML(data) {
  const { personalInfo, skills, projects, experience } = data;
  
  const enhancedSkills = enhanceSkills(skills);
  const summary = generateSummary(data);

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName} | Portfolio</title>
  <style>
    :root {
      --bg: #0f172a;
      --surface: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #6366f1;
    }
    body {
      margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif;
      background: var(--bg); color: var(--text); line-height: 1.6;
    }
    header { padding: 4rem 2rem; text-align: center; background: var(--surface); border-bottom: 1px solid #334155; }
    h1 { font-size: 2.5rem; margin: 0 0 0.5rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: var(--text-muted); font-size: 1.2rem; max-width: 600px; margin: 0 auto 1.5rem; }
    .contact-links a { color: var(--text); text-decoration: none; padding: 0.5rem 1rem; border-radius: 99px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); margin: 0 0.5rem; font-size: 0.9rem; transition: all 0.2s; }
    .contact-links a:hover { background: var(--accent); }
    main { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
    section { margin-bottom: 4rem; }
    h2 { font-size: 1.8rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
    h2::after { content: ""; flex: 1; height: 1px; background: #334155; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .skill-tag { background: var(--surface); padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500; font-size: 0.9rem; border: 1px solid #334155; }
    .project-card { background: var(--surface); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid #334155; }
    .project-card h3 { margin: 0 0 0.5rem; color: #818cf8; }
    .project-card p { color: var(--text-muted); margin-bottom: 1rem; font-size: 0.95rem; }
    .project-bullets { padding-left: 1.2rem; margin: 0; color: #cbd5e1; font-size: 0.9rem; }
    .project-bullets li { margin-bottom: 0.4rem; }
    footer { text-align: center; padding: 2rem; color: var(--text-muted); border-top: 1px solid #334155; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <h1>${personalInfo.fullName}</h1>
    <p class="subtitle">${summary}</p>
    <div class="contact-links">
      ${personalInfo.email ? '<a href="mailto:' + personalInfo.email + '">Email Me</a>' : ''}
      ${personalInfo.linkedin ? '<a href="' + (personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : 'https://' + personalInfo.linkedin) + '" target="_blank">LinkedIn / GitHub</a>' : ''}
    </div>
  </header>
  <main>
`;

  if (enhancedSkills.length > 0) {
    html += `
    <section>
      <h2>Technical Arsenal</h2>
      <div class="skills-grid">
        ${enhancedSkills.map(s => `<div class="skill-tag">${s}</div>`).join('')}
      </div>
    </section>
`;
  }

  if (experience.length > 0) {
    html += `<section><h2>Experience</h2>`;
    experience.forEach(exp => {
      const enhanced = enhanceExperienceDetails(exp.details);
      html += `
      <div class="project-card">
        <h3>${enhanced.heading.replace(/<[^>]*>?/gm, '')}</h3>
        <ul class="project-bullets">
          ${enhanced.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>`;
    });
    html += `</section>`;
  }

  if (projects.length > 0) {
    html += `<section><h2>Featured Projects</h2>`;
    projects.forEach(proj => {
      const enhanced = enhanceProjectDetails(proj.details);
      html += `
      <div class="project-card">
        <h3>${enhanced.title}</h3>
        <ul class="project-bullets">
          ${enhanced.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>`;
    });
    html += `</section>`;
  }

  html += `
  </main>
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. Designed with ReBuilder AI.</p>
  </footer>
</body>
</html>
`;

  return html.trim();
}

// ═══════════════════════════════════════════════════════════════
// MOCK INTERVIEW GENERATOR
// ═══════════════════════════════════════════════════════════════
export function generateMockInterview(data) {
  const questions = [];
  const { skills, projects, experience, targetRole } = data;

  // Behavioral questions
  questions.push("Tell me about yourself and your background.");
  if (experience.length > 0) {
    questions.push("Can you describe a time when you faced a significant technical challenge in your previous role, and how you overcame it?");
    questions.push("How do you handle disagreements with team members or stakeholders regarding technical decisions?");
  }

  // Project-based questions
  if (projects.length > 0) {
    // Pick the first project to ask about
    const firstProj = enhanceProjectDetails(projects[0].details).title;
    questions.push(`In your resume, you mentioned "${firstProj}". Can you dive deep into your specific contributions and the architecture you chose?`);
    questions.push("If you had to rebuild one of your projects from scratch today, what would you do differently?");
  }

  // Technical/Skill questions (heuristic based)
  const allSkillsText = skills.join(' ').toLowerCase();
  
  if (allSkillsText.includes('react') || allSkillsText.includes('vue') || allSkillsText.includes('frontend')) {
    questions.push("How do you approach state management in complex frontend applications?");
    questions.push("Explain how you would optimize the performance and load time of a web application.");
  }
  
  if (allSkillsText.includes('node') || allSkillsText.includes('python') || allSkillsText.includes('backend') || allSkillsText.includes('java')) {
    questions.push("How do you design scalable RESTful APIs? What security considerations do you keep in mind?");
    questions.push("Explain the difference between SQL and NoSQL databases. When would you choose one over the other?");
  }
  
  if (allSkillsText.includes('aws') || allSkillsText.includes('docker') || allSkillsText.includes('cloud')) {
    questions.push("Can you explain your experience with containerization and continuous integration/continuous deployment (CI/CD) pipelines?");
  }

  // Role specific
  if (targetRole) {
    questions.push(`Why are you interested in a ${targetRole} role specifically?`);
  }

  return questions;
}

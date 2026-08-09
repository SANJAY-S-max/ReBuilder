import { enhanceSkills, enhanceBullet } from './resumeRenderer.js';

function enhanceProjectDetails(rawDetails) {
  const lines = rawDetails.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: '', bullets: [] };
  let title = lines[0];
  let descLines = lines.slice(1);
  const dashSplit = title.match(/^(.+?)[\s]*[—–-][\s]*(.+)$/);
  if (dashSplit && descLines.length === 0) {
    title = dashSplit[1].trim();
    descLines = [dashSplit[2].trim()];
  }
  const bullets = descLines.map(enhanceBullet).filter(Boolean);
  return { title, bullets };
}

function enhanceExperienceDetails(rawDetails) {
  const lines = rawDetails.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { heading: '', bullets: [] };
  const heading = lines[0];
  const bullets = lines.slice(1).map(enhanceBullet).filter(Boolean);
  return { heading, bullets };
}

export function matchJobDescription(data, jdText) {
  if (!jdText?.trim()) return { matchPercentage: 0, missingSkills: [], improvements: [] };

  const jdLower = jdText.toLowerCase();
  const resumeText = [
    ...data.skills,
    data.targetRole,
    ...data.projects.map((p) => p.details),
    ...data.experience.map((e) => e.details),
  ].join(' ').toLowerCase();

  const commonTech = [
    'react', 'node.js', 'nodejs', 'python', 'java', 'c++', 'javascript', 'typescript',
    'aws', 'docker', 'kubernetes', 'sql', 'mongodb', 'postgresql', 'mysql', 'agile',
    'scrum', 'git', 'ci/cd', 'machine learning', 'ai', 'html', 'css', 'vue', 'angular',
    'django', 'spring', 'flask', 'rest api', 'graphql',
  ];

  const requiredSkills = commonTech.filter((tech) => jdLower.includes(tech));
  const missingSkills = requiredSkills.filter((skill) => !resumeText.includes(skill));
  const foundSkills = requiredSkills.filter((skill) => resumeText.includes(skill));

  let matchPercentage = 0;
  if (requiredSkills.length > 0) {
    matchPercentage = Math.round((foundSkills.length / requiredSkills.length) * 100);
  } else {
    const jdWords = new Set(jdLower.split(/\s+/).filter((w) => w.length > 4));
    let matchCount = 0;
    jdWords.forEach((word) => { if (resumeText.includes(word)) matchCount++; });
    matchPercentage = Math.min(100, Math.round((matchCount / Math.max(jdWords.size, 1)) * 100 * 2));
  }

  const improvements = [];
  if (missingSkills.length > 0) {
    improvements.push(`Add these keywords to your skills or experience: ${missingSkills.slice(0, 5).join(', ')}.`);
  }
  if (matchPercentage < 50) {
    improvements.push('Tailor project descriptions to highlight technologies mentioned in the job description.');
  } else if (matchPercentage < 80) {
    improvements.push('Good match — explicitly mention missing tools in your bullet points.');
  } else {
    improvements.push('Excellent alignment with this job description.');
  }

  return { matchPercentage, missingSkills, improvements };
}

export function generatePortfolioHTML(data) {
  const { personalInfo, skills, projects, experience } = data;
  const enhancedSkills = enhanceSkills(skills);
  const summary = data.targetRole || 'Professional Portfolio';

  let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${personalInfo.fullName} | Portfolio</title>
<style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f8fafc;color:#1e293b;line-height:1.6}header{padding:3rem 2rem;text-align:center;background:#fff;border-bottom:1px solid #e2e8f0}h1{font-size:2rem;margin:0 0 .5rem;color:#111827}.subtitle{color:#64748b;max-width:600px;margin:0 auto 1rem}main{max-width:800px;margin:0 auto;padding:2rem}section{margin-bottom:2.5rem}h2{font-size:1.4rem;border-bottom:2px solid #1e40af;padding-bottom:.5rem;margin-bottom:1rem}.skills{display:flex;flex-wrap:wrap;gap:.5rem}.skill{background:#eff6ff;color:#1e40af;padding:.35rem .75rem;border-radius:4px;font-size:.875rem}.card{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:1.25rem;margin-bottom:1rem}ul{padding-left:1.25rem;color:#475569;font-size:.9rem}</style></head><body>
<header><h1>${personalInfo.fullName}</h1><p class="subtitle">${summary}</p></header><main>`;

  if (enhancedSkills.length) {
    html += `<section><h2>Skills</h2><div class="skills">${enhancedSkills.map((s) => `<span class="skill">${s}</span>`).join('')}</div></section>`;
  }
  if (experience.length) {
    html += `<section><h2>Experience</h2>`;
    experience.forEach((exp) => {
      const e = enhanceExperienceDetails(exp.details);
      html += `<div class="card"><strong>${e.heading}</strong><ul>${e.bullets.map((b) => `<li>${b}</li>`).join('')}</ul></div>`;
    });
    html += `</section>`;
  }
  if (projects.length) {
    html += `<section><h2>Projects</h2>`;
    projects.forEach((proj) => {
      const p = enhanceProjectDetails(proj.details);
      html += `<div class="card"><strong>${p.title}</strong><ul>${p.bullets.map((b) => `<li>${b}</li>`).join('')}</ul></div>`;
    });
    html += `</section>`;
  }
  html += `</main></body></html>`;
  return html;
}

export function generateMockInterview(data) {
  const questions = ['Tell me about yourself and your background.'];
  const { skills, projects, experience, targetRole } = data;

  if (experience.length > 0) {
    questions.push('Describe a significant technical challenge you faced and how you resolved it.');
    questions.push('How do you handle disagreements with team members on technical decisions?');
  }
  if (projects.length > 0) {
    const title = enhanceProjectDetails(projects[0].details).title;
    questions.push(`Walk me through your project "${title}" — your role, architecture, and key decisions.`);
  }

  const allSkills = skills.join(' ').toLowerCase();
  if (/react|vue|frontend/.test(allSkills)) {
    questions.push('How do you approach state management and performance optimization in frontend applications?');
  }
  if (/node|python|java|backend/.test(allSkills)) {
    questions.push('How do you design scalable RESTful APIs? What security practices do you follow?');
  }
  if (/aws|docker|cloud/.test(allSkills)) {
    questions.push('Describe your experience with CI/CD pipelines and cloud deployment.');
  }
  if (targetRole) questions.push(`Why are you interested in a ${targetRole} role?`);

  return questions;
}

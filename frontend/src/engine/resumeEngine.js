// Resume Builder Engine - Dynamic Question Flow

const QUESTION_FLOW = {
  // Common opening
  userType: {
    id: 'userType',
    question: "Welcome to **ReBuilder**! 🚀\n\nLet's craft a resume that gets you noticed. First, tell me — are you a **Fresher** or an **Experienced** professional?",
    type: 'choice',
    choices: ['Fresher', 'Experienced'],
    field: 'userType',
    section: 'classification',
    required: true,
  },

  // Personal Info
  fullName: {
    id: 'fullName',
    question: "Great! Let's start with your **full name** as you'd like it on your resume.",
    type: 'text',
    field: 'fullName',
    section: 'personalInfo',
    required: true,
    placeholder: 'e.g., John Doe',
    validate: (val) => val.trim().length >= 2 ? null : 'Please enter your full name (at least 2 characters).',
  },
  email: {
    id: 'email',
    question: "What's your **email address**?",
    type: 'text',
    field: 'email',
    section: 'personalInfo',
    required: true,
    placeholder: 'e.g., john@example.com',
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Please enter a valid email address.',
  },
  phone: {
    id: 'phone',
    question: "Your **phone number**?",
    type: 'text',
    field: 'phone',
    section: 'personalInfo',
    required: true,
    placeholder: 'e.g., +91 98765 43210',
    validate: (val) => val.replace(/\D/g, '').length >= 10 ? null : 'Please enter a valid phone number (at least 10 digits).',
  },
  location: {
    id: 'location',
    question: "Where are you **located**? (City, State/Country)",
    type: 'text',
    field: 'location',
    section: 'personalInfo',
    required: true,
    placeholder: 'e.g., Bangalore, India',
  },
  linkedin: {
    id: 'linkedin',
    question: "Do you have a **LinkedIn** or **GitHub** profile? (Optional — but recommended!)\n\nYou can share one or both links, or type `skip` to move on.",
    type: 'text',
    field: 'linkedin',
    section: 'personalInfo',
    required: false,
    placeholder: 'e.g., linkedin.com/in/johndoe',
    skippable: true,
  },

  // Education
  education: {
    id: 'education',
    question: "Tell me about your **education**.\n\nPlease include: **Degree, College/University, Graduation Year, and CGPA/Percentage**.",
    type: 'text',
    field: 'education',
    section: 'education',
    required: true,
    placeholder: 'e.g., B.Tech Computer Science, XYZ University, 2024, 8.5 CGPA',
    multiline: true,
  },

  // Skills
  skills: {
    id: 'skills',
    question: "What are your **technical skills and tools**?\n\nList them separated by commas — include programming languages, frameworks, tools, and soft skills.",
    type: 'text',
    field: 'skills',
    section: 'skills',
    required: true,
    placeholder: 'e.g., Python, React, Node.js, Git, SQL, Agile',
    multiline: true,
  },

  // Projects
  projectCount: {
    id: 'projectCount',
    question: "How many **projects** would you like to showcase? (We recommend 2-4)",
    type: 'text',
    field: 'projectCount',
    section: 'projects',
    required: true,
    placeholder: 'e.g., 3',
    validate: (val) => {
      const num = parseInt(val);
      return (!isNaN(num) && num >= 0 && num <= 10) ? null : 'Please enter a number between 0 and 10.';
    },
  },
  project: {
    id: 'project',
    question: "Tell me about **Project {index}**.\n\nInclude the **title**, a brief **description** of what it does, and the **tech stack** used.",
    type: 'text',
    field: 'project',
    section: 'projects',
    required: true,
    multiline: true,
    placeholder: 'e.g., E-Commerce App — A full-stack online store with cart, payments & admin dashboard. Built with React, Node.js, MongoDB.',
    suggestion: '💡 Tip: Instead of "Did a project", try "Developed X using Y, resulting in Z"',
  },

  // Internships (Fresher only)
  hasInternships: {
    id: 'hasInternships',
    question: "Have you done any **internships**?",
    type: 'choice',
    choices: ['Yes', 'No'],
    field: 'hasInternships',
    section: 'internships',
    required: true,
    fresherOnly: true,
  },
  internshipCount: {
    id: 'internshipCount',
    question: "How many internships would you like to include?",
    type: 'text',
    field: 'internshipCount',
    section: 'internships',
    required: true,
    fresherOnly: true,
    placeholder: 'e.g., 2',
    validate: (val) => {
      const num = parseInt(val);
      return (!isNaN(num) && num >= 1 && num <= 5) ? null : 'Please enter a number between 1 and 5.';
    },
  },
  internship: {
    id: 'internship',
    question: "Tell me about **Internship {index}**.\n\nInclude: **Company, Role, Duration**, and what you worked on.",
    type: 'text',
    field: 'internship',
    section: 'internships',
    required: true,
    fresherOnly: true,
    multiline: true,
    placeholder: 'e.g., Google — Frontend Intern — Summer 2023 — Built UI components for internal tools using React',
  },

  // Work Experience (Experienced only)
  experienceCount: {
    id: 'experienceCount',
    question: "How many **work experiences** would you like to include?",
    type: 'text',
    field: 'experienceCount',
    section: 'experience',
    required: true,
    experiencedOnly: true,
    placeholder: 'e.g., 2',
    validate: (val) => {
      const num = parseInt(val);
      return (!isNaN(num) && num >= 1 && num <= 10) ? null : 'Please enter a number between 1 and 10.';
    },
  },
  experience: {
    id: 'experience',
    question: "Tell me about **Experience {index}**.\n\nInclude: **Company, Role, Duration**, and your key **achievements/responsibilities**.",
    type: 'text',
    field: 'experience',
    section: 'experience',
    required: true,
    experiencedOnly: true,
    multiline: true,
    placeholder: 'e.g., TCS — Senior Developer — Jan 2021 to Present — Led a team of 5 to build microservices architecture, reducing API latency by 40%',
    suggestion: '💡 Tip: Use action verbs and quantify impact. "Led", "Developed", "Reduced", "Increased".',
  },

  // Certifications
  hasCertifications: {
    id: 'hasCertifications',
    question: "Do you have any **certifications**?",
    type: 'choice',
    choices: ['Yes', 'No'],
    field: 'hasCertifications',
    section: 'certifications',
    required: true,
  },
  certifications: {
    id: 'certifications',
    question: "List your **certifications** (one per line or comma-separated).\n\nInclude the certification name and issuing organization.",
    type: 'text',
    field: 'certifications',
    section: 'certifications',
    required: true,
    multiline: true,
    placeholder: 'e.g., AWS Solutions Architect — Amazon\nGoogle Cloud Professional — Google',
  },

  // Achievements
  hasAchievements: {
    id: 'hasAchievements',
    question: "Any notable **achievements or awards** you'd like to highlight?",
    type: 'choice',
    choices: ['Yes', 'No'],
    field: 'hasAchievements',
    section: 'achievements',
    required: true,
  },
  achievements: {
    id: 'achievements',
    question: "List your **achievements** (one per line or comma-separated).",
    type: 'text',
    field: 'achievements',
    section: 'achievements',
    required: true,
    multiline: true,
    placeholder: 'e.g., Won first place in National Hackathon 2023\nPublished research paper in IEEE',
  },

  // Target role
  targetRole: {
    id: 'targetRole',
    question: "Finally — what **role/job title** are you targeting? This helps optimize your resume for ATS.",
    type: 'text',
    field: 'targetRole',
    section: 'meta',
    required: true,
    placeholder: 'e.g., Full Stack Developer',
  },
};

// Build the question sequence based on user type
export function getQuestionSequence(userType) {
  const common = ['fullName', 'email', 'phone', 'location', 'linkedin'];
  
  if (userType === 'Fresher') {
    return [
      ...common,
      'education', 'skills', 'projectCount',
      // projects will be injected dynamically
      'hasInternships',
      // internships will be injected dynamically
      'hasCertifications',
      // certifications injected conditionally
      'hasAchievements',
      // achievements injected conditionally
      'targetRole',
    ];
  } else {
    return [
      ...common,
      'experienceCount',
      // experiences injected dynamically
      'skills', 'projectCount',
      // projects injected dynamically
      'education',
      'hasCertifications',
      'hasAchievements',
      'targetRole',
    ];
  }
}

export function getQuestion(id) {
  return QUESTION_FLOW[id] || null;
}

// Build structured JSON from collected answers
export function buildResumeJSON(answers) {
  const personalInfo = {
    fullName: answers.fullName || '',
    email: answers.email || '',
    phone: answers.phone || '',
    location: answers.location || '',
    linkedin: (answers.linkedin && answers.linkedin.toLowerCase() !== 'skip') ? answers.linkedin : '',
  };

  // Parse education
  const education = [{
    details: answers.education || '',
  }];

  // Parse skills
  const skillsList = (answers.skills || '').split(/[,\n]/).map(s => s.trim()).filter(Boolean);

  // Parse projects
  const projects = [];
  const projCount = parseInt(answers.projectCount) || 0;
  for (let i = 1; i <= projCount; i++) {
    if (answers[`project_${i}`]) {
      projects.push({ details: answers[`project_${i}`] });
    }
  }

  // Parse experience
  const experience = [];
  const expCount = parseInt(answers.experienceCount) || 0;
  for (let i = 1; i <= expCount; i++) {
    if (answers[`experience_${i}`]) {
      experience.push({ details: answers[`experience_${i}`] });
    }
  }

  // Parse internships
  const internships = [];
  const intCount = parseInt(answers.internshipCount) || 0;
  for (let i = 1; i <= intCount; i++) {
    if (answers[`internship_${i}`]) {
      internships.push({ details: answers[`internship_${i}`] });
    }
  }

  // Parse certifications
  const certifications = answers.certifications
    ? answers.certifications.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    : [];

  // Parse achievements
  const achievementsList = answers.achievements
    ? answers.achievements.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    : [];

  return {
    personalInfo,
    education,
    skills: skillsList,
    projects,
    experience,
    internships,
    certifications,
    achievements: achievementsList,
    targetRole: answers.targetRole || '',
    userType: answers.userType || '',
  };
}

export default QUESTION_FLOW;

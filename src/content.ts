export const github = 'https://github.com/Amrr13';
export const age = 21;

export const categories = ['All projects', 'AI & ML', 'Robotics', 'Hardware'] as const;
export type Category = (typeof categories)[number];

export type Project = {
  id: string;
  title: string;
  category: Exclude<Category, 'All projects'>;
  summary: string;
  detail: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: 'e3raab',
    title: 'Arabic Grammar Analyzer',
    category: 'AI & ML',
    summary: 'An Arabic grammar analyzer that breaks a sentence down word by word.',
    detail: 'Built with a team at New Mansoura University, e3raab uses natural language processing to identify the grammatical roles of words in Arabic text, a practice known as iʿrāb.',
    tags: ['Arabic NLP', 'Machine learning'],
  },
  {
    id: 'exam-detector',
    title: 'Online Exam Monitoring',
    category: 'AI & ML',
    summary: 'A machine learning project exploring signals for online exam review.',
    detail: 'The project explores behavioral patterns, keystroke dynamics, and facial recognition as inputs for flagging activity for review during online exams.',
    tags: ['Computer vision', 'Deep learning'],
  },
  {
    id: 'ev3',
    title: 'EV3 Competition Robot',
    category: 'Robotics',
    summary: 'A LEGO Mindstorms EV3 robot built for FIRST LEGO League.',
    detail: 'I developed and programmed an EV3 robot that earned first place in Egypt’s FIRST LEGO League.',
    tags: ['LEGO Mindstorms', 'Robot programming'],
  },
  {
    id: 'water-filter',
    title: 'Smart Water Filter',
    category: 'Hardware',
    summary: 'A sensor-based filtration prototype that monitors water quality.',
    detail: 'The system reads water quality in real time and uses those readings to control the direction of water flow.',
    tags: ['IoT', 'Sensors', 'Automation'],
  },
  {
    id: 'diabetes',
    title: 'Diabetes Risk Prediction',
    category: 'AI & ML',
    summary: 'A machine learning project exploring risk prediction from health data.',
    detail: 'I used health data to explore how machine learning can estimate diabetes risk. This was a data analysis and modeling project.',
    tags: ['Machine learning', 'Data analysis'],
  },
  {
    id: 'vacuum',
    title: 'Autonomous Vacuum Cleaner',
    category: 'Robotics',
    summary: 'An AI-assisted vacuum cleaner prototype designed to navigate autonomously.',
    detail: 'I integrated machine learning into a vacuum cleaner to explore how it could navigate a space and adapt its cleaning path.',
    tags: ['Robotics', 'AI', 'Automation'],
  },
  {
    id: 'helpbot',
    title: 'HelpBot',
    category: 'Robotics',
    summary: 'A robotics prototype for detecting gas and flames.',
    detail: 'HelpBot combines gas and flame sensing with an automated response. The prototype includes a SIM module for alerts and a mechanism for responding to detected flames.',
    tags: ['Robotics', 'Hardware', 'Sensors'],
  },
  {
    id: 'irrigation',
    title: 'Automatic Irrigation',
    category: 'Hardware',
    summary: 'A soil moisture sensor system that automates plant watering.',
    detail: 'I built an irrigation system that reads soil moisture and uses it to decide when to water plants.',
    tags: ['Sensors', 'Automation'],
  },
  {
    id: 'piezo',
    title: 'Piezoelectric Generator',
    category: 'Hardware',
    summary: 'A prototype that converts pressure into electricity.',
    detail: 'I designed a generator using piezoelectric materials to explore how pressure from a passing vehicle could generate electricity.',
    tags: ['Hardware', 'Energy'],
  },
];

export const skills = [
  { title: 'AI & machine learning', items: ['Machine learning', 'Deep learning', 'Neural networks', 'NLP', 'Computer vision'] },
  { title: 'Languages & frameworks', items: ['Python', 'C++', 'SQL', 'PyTorch', 'Keras'] },
  { title: 'Robotics & data', items: ['Robotics', 'Data analysis', 'Sensors', 'Automation'] },
];

export type Credential = {
  title: string;
  issuer: string;
  image?: string;
  pdf?: string;
  period?: string;
};

export const credentials: Credential[] = [
  { title: 'Machine Learning', issuer: 'National Telecommunication Institute (NTI) & ITIDA', image: '/NTI.jpeg' },
  { title: 'Artificial Intelligence Track', issuer: 'NTI / Huawei Egyptian Talent Academy', image: '/NTI%202.jpeg' },
  {
    title: 'DEPI — AI & Data Science: Microsoft Machine Learning Engineer',
    issuer: 'Digital Egypt Pioneers Program · Ministry of Communications and Information Technology, Egypt',
    period: 'November 2025 – July 2026',
    image: '/depi-certificate.webp',
    pdf: '/depi-certificate.pdf',
  },
  { title: 'Getting Started with Deep Learning', issuer: 'NVIDIA', image: '/nvidia%20.jpeg' },
  { title: 'AI & ML Summer Camp', issuer: 'Sprints × Microsoft', image: '/microsoft.jpeg' },
  { title: 'Building LLM Applications with Prompt Engineering', issuer: 'NVIDIA', image: '/nvidiaLLM.jpeg' },
  { title: 'Transact-SQL Queries Using SQL Server', issuer: 'Mahara-Tech / ITI', image: '/WhatsApp%20Image%202026-03-05%20at%2017.35.46.jpeg' },
];

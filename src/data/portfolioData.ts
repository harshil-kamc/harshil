import { Project, SkillCategory, EducationItem, Competition } from "../types/portfolio";

export const EDUCATION_DATA: EducationItem[] = [
  {
    qualification: "Bachelor of Engineering",
    fieldStream: "Computer Science & Information Technology (CSIT)",
    institution: "MVSR Engineering College",
    duration: "2024 – 2028\n(Currently Pursuing)"
  },
  {
    qualification: "Intermediate",
    fieldStream: "MPC",
    institution: "Narayana Junior College",
    duration: "2022 – 2024"
  },
  {
    qualification: "S.S.C",
    fieldStream: "State Board",
    institution: "Bhashyam High School",
    duration: "May 2022"
  }
];

export const LANGUAGES_KNOWN: string[] = [
  "C",
  "Python",
  "DSA (Data Structures & Algorithms)",
  "Java",
  "HTML",
  "CSS",
  "RDBMS",
  "SQL"
];

export const COMPETITION_CERTIFICATES_DRIVE_URL = "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt";

const COMPETITION_ENTRIES: Competition[] = [
  {
    id: "comp-1",
    startDate: "2025-12-05",
    title: "IEEE Cyber Ektha CTF Hackathon",
    organizer: "MVSR Engineering College & IEEE",
    venue: "MVSR Engineering College",
    date: "5th – 6th December 2025",
    duration: "24 Hours Offline",
    type: "CTF Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "A 24-hour intense Capture The Flag (CTF) cybersecurity hackathon conducted at MVSR Engineering College. Tackled challenging reverse engineering, web exploitation, network forensics, and and cryptography challenges as a team.",
    projectOrFocus: "Reverse Engineering, Web Exploitation & Cryptography",
    certificateUrl: "https://drive.google.com/file/d/15VaArUe63LCN3V8rYNDbmTbmMgtcf5BE/view?usp=drive_link",
    tags: [ "CTF", "Cybersecurity", "24hr Hackathon", "IEEE"]
  },
  {
    id: "comp-2",
    startDate: "2026-02-27",
    title: "IEEE TKR Hackconquest 2.0",
    organizer: "TKR Engineering College & IEEE",
    venue: "TKR Engineering College",
    date: "27th – 28th February 2026",
    duration: "24 Hours Offline",
    type: "Offline Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "A 24-hour offline hackathon conducted at TKR Engineering College. Built the DeepSafe project, collaborating on high-speed ideation, software architecture design, and rapid sprint prototyping.",
    projectOrFocus: "DeepSafe — AI-Powered Media Analysis System",
    projectId: "proj-deepsafe",
    projectName: "DeepSafe",
    projectRole: "Frontend dev",
    certificateUrl: "https://drive.google.com/file/d/1XyQZIW7M9b_6idwH1eGQdj4cMZjalrdu/view?usp=drive_link",
    certificateImage: "https://i.ibb.co/hntps62/IMG-20260308-220536.jpg",
    tags: ["Offline Hackathon", "24hr Sprint", "IEEE", "DeepSafe"],
    images: [
      "https://i.ibb.co/RTB7MpXD/1788708407972-1.jpg",
      "https://i.ibb.co/DHmDMh3F/1788708414500.jpg",
      "https://i.ibb.co/N6Mbmb6x/1788708412392.jpg",
      "https://i.ibb.co/Rpn1zjRV/1000023362.jpg"
    ]
  },
  {
    id: "comp-3",
    startDate: "2026-02-17",
    title: "CodeSangram Online Hackathon",
    organizer: "QuizCred with WebTantra & CyberSudarshan",
    teamName: "Digital Piece",
    venue: "Online",
    date: "17th - 28th February 2026",
    duration: "Multi-Round Online Sprint",
    type: "Online Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "An online hackathon organised by QuizCred with WebTantra and CyberSudarshan. Engineered the Localoop platform, solving competitive problem statements for seamless community-government interaction.",
    projectOrFocus: "Localoop — Citizen & Governance Connecting Platform",
    projectId: "proj-localoop",
    projectName: "Localoop",
    projectRole: "Full Stack dev",
    certificateUrl: "https://i.ibb.co/xSVFhzDj/98fc5781-f563-4257-a3a7-d4a2c6f03190.jpg",
    certificateImage: "https://i.ibb.co/xSVFhzDj/98fc5781-f563-4257-a3a7-d4a2c6f03190.jpg",
    tags: ["Online Hackathon", "Unstop", "Quizcred", "Localoop"]
  },
  {
    id: "comp-4",
    startDate: "2026-02-18",
    title: "National AI/ML Hackathon",
    organizer: "Vivriti Capital & Yuvaan, IIT Hyderabad",
    teamName: "Digital Piece",
    venue: "Online",
    date: "18th Feb – 22nd March 2026",
    duration: "Month-long Hackathon",
    type: "Online Hackathon",
    result: "National Participant",
    awardRank: "Participant",
    description: "A competitive national-level AI/ML hackathon by Vivriti Capital, organised with Yuvaan at IIT Hyderabad. Built the AI Loan Lending Risk predictive model assessing credit risk for applicants using advanced algorithms.",
    projectOrFocus: "AI Loan Lending Risk — Predictive Credit Assessment Model",
    projectId: "proj-loan-risk",
    projectName: "AI Loan Lending Risk",
    projectRole: "Full Stack dev",
    certificateUrl: "https://i.ibb.co/BVzmVZ7g/a18d241e-6d7f-4309-b8e9-0fede28c64c4.jpg",
    certificateImage: "https://i.ibb.co/BVzmVZ7g/a18d241e-6d7f-4309-b8e9-0fede28c64c4.jpg",
    tags: ["AI/ML", "Vivriti Capital", "Yuvaan", "Unstop", "Data Science"]
  },
  {
    id: "comp-5",
    startDate: "2026-03-10",
    title: "GFG Hackfest",
    organizer: "GeeksForGeeks (GFG)",
    venue: "GFG Institution, Madhapur",
    date: "10th – 17th March 2026",
    duration: "1-Week Hackfest (Onsite Finale)",
    type: "Offline Hackathon",
    result: "1st Prize",
    isWinner: true,
    awardRank: "1st",
    description: "A prestigious hackathon organized by GeeksForGeeks at the GFG Institution in Madhapur. Engineered TruthNova — a comprehensive fake news detection and analysis system. Submitted and defended live on 17th March, securing 1st Prize.",
    projectOrFocus: "TruthNova — Fake News Detection & Analysis System (1st Prize)",
    projectId: "proj-truthnova",
    projectName: "TruthNova",
    projectRole: "Frontend dev",
    certificateUrl: "https://i.ibb.co/7JBqG6PS/2577ea0e03f220549358076b732e79ae.png",
    certificateImage: "https://i.ibb.co/7JBqG6PS/2577ea0e03f220549358076b732e79ae.png",
    certificateKind: "participation",
    tags: ["1st Prize", "GeeksForGeeks", "GFG Madhapur", "TruthNova"]
  },
  {
    id: "comp-6",
    startDate: "2026-03-27",
    title: "Forge Inspira 2026",
    organizer: "Forge Alumnus & IIT Hyderabad",
    venue: "IIT Hyderabad",
    date: "27th – 29th March 2026",
    duration: "24 Hours Offline",
    type: "Offline Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "An intensive 24-hour offline hackathon hosted at IIT Hyderabad by Forge Alumnus as part of Forge Inspira 2026. Developed OrbitHire — a full-stack platform tailored for job seekers to connect with employers.",
    projectOrFocus: "OrbitHire — Job Seeker & Employer Connection Platform",
    projectId: "proj-orbithire",
    projectName: "OrbitHire",
    projectRole: "Frontend dev",
    certificateUrl: "https://i.ibb.co/4ZBcv1Xn/Hackathon-Certificate-Kamchetty-Harshil-1.png",
    certificateImage: "https://i.ibb.co/4ZBcv1Xn/Hackathon-Certificate-Kamchetty-Harshil-1.png",
    tags: ["IIT Hyderabad", "Forge Inspira", "OrbitHire", "24hr Hackathon"]
  },
  {
    id: "comp-7",
    startDate: "2026-04-12",
    title: "MYBHARAT Budget Quest 2026",
    organizer: "Ministry of Youth Affairs / MyBharat, Govt. of India",
    venue: "Kanha Shanti Vanam, Hyderabad",
    date: "12th – 13th April 2026",
    duration: "National Multi-Round Summit",
    teamName: "Individual Representation",
    type: "National Competition",
    result: "Telangana State Winner",
    isWinner: true,
    awardRank: "Winner",
    description: "A nationwide competitive event with over 12 Lakh (1.2+ Million) participants across India. Participated and won across both the national budget quiz and policy essay rounds, emerging as a Telangana State Winner, one of about 500 state winners nationwide. Attended the prestigious Budget Quest program held at Kanha Shanti Vanam on 12-13th April.",
    projectOrFocus: "National Budget Policy Essay & Grand Quiz Rounds",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["State Winner", "MyBharat", "National Honor", "12+ Lakh Participants", "Govt of India"]
  },
  {
    id: "comp-8",
    startDate: "2026-04-17",
    title: "Aethronix Hackathon (Samavarthan 2k26)",
    organizer: "MVSR Engineering College",
    venue: "MVSR Engineering College",
    date: "17th – 18th April 2026",
    duration: "24 Hours Offline",
    type: "Offline Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "A 24-hour offline hackathon organized as part of the Samavarthan 2k26 national technical symposium at MVSR Engineering College. Developed PathPilot AI — an intelligent career guidance system.",
    projectOrFocus: "PathPilot AI — Career Guidance & Roadmap Platform",
    projectId: "proj-pathpilot",
    projectName: "PathPilot AI",
    projectRole: "Backend dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["24hr Hackathon", "MVSR College", "PathPilot AI", "Samavarthan 2k26"]
  },
  {
    id: "comp-9",
    startDate: "2026-05-23",
    title: "Secleaf Q2 CTF 2026",
    organizer: "Secleaf",
    venue: "International / Online",
    date: "23rd – 24th May 2026",
    duration: "24 Hours",
    teamName: "Ctrl Alt Defeat",
    type: "CTF Hackathon",
    result: "International CTF Participant",
    awardRank: "Participant",
    description: "A 24-hour international online CTF cybersecurity hackathon conducted by Secleaf. Competed in team Ctrl Alt Defeat, cracking challenges in cryptography, binary exploitation, web security, and network defenses.",
    projectOrFocus: "International Cybersecurity & CTF Exploitation",
    certificateUrl: "https://i.ibb.co/LhrgLd6R/SLQ2-0763.png",
    certificateImage: "https://i.ibb.co/LhrgLd6R/SLQ2-0763.png",
    tags: ["International CTF", "Secleaf", "Cybersecurity", "Ctrl Alt Defeat", "24hr CTF"]
  }
];

// Oldest first, so the book and the cards read as a timeline
export const COMPETITIONS_LIST: Competition[] = [...COMPETITION_ENTRIES].sort((a, b) =>
  a.startDate.localeCompare(b.startDate)
);

export const HARSHIL_BIO = {
  name: "Harshil",
  fullName: "HARSHIL KAMCHETTY",
  role: "Student Coder & Tech Enthusiast",
  tagline: "Coding my way through technology, with a little help from AI.",
  aboutText: `I am a computer science student with a deep fascination for interactive graphics, full-stack systems, and elegant user interfaces. I love taking complex technical challenges and turning them into intuitive, visually fluid digital experiences.`,
  whatsapp: "916304654185", // Used only for the wa.me link; number is not displayed
  email: "Harshilkamc@gmail.com",
  portfolioUrl: "https://harshil-kamc.github.io/Portfolio/",
  education: "B.E. in CSIT (MVSR Engineering College)",
  github: "https://github.com/harshil-kamc",
  linkedin: "https://in.linkedin.com/in/harshil-kamchetty-170a473bb",
  careerObjective: "Motivated and detail-oriented student pursuing a Engineering Degree with strong academic performance and a passion for Computer Science field. Eager to apply theoretical knowledge to real-world challenges, contribute to team success, and develop professional skills in a dynamic work environment.",
  stats: [
    { label: "Projects Built", value: "7" },
    { label: "Competitions & Hackathons", value: "9" },
    { label: "1st Prize & State Win", value: "2" },
    { label: "Projects Built at Hackathons", value: "6" },
  ]
};

export const DEFAULT_PARTICLE_IMAGES = [
  "https://i.ibb.co/8DpK0v51/264511853.png", 
  
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "proj-deepsafe",
    title: "DeepSafe",
    role: "Frontend dev",
    description: "An AI-powered system designed to identify and analyze synthetic media to combat misinformation online.",
    longDescription: "An AI-powered system designed to identify and analyze synthetic media to combat misinformation online. Built during the IEEE TKR Hackconquest 24-hr hackathon, focusing on real-time spatial and facial forgery detection interface workflows.",
    category: "Full Stack",
    tags: ["React", "AI Detection", "Frontend", "Synthetic Media", "TKR Hackconquest"],
    featured: true,
    metrics: "IEEE TKR Hackathon",
    githubUrl: "https://github.com/harshil-kamc/DeepSafe",
    demoUrl: "https://deepsafe-dp.netlify.app/",
    hackathonName: "IEEE TKR Hackconquest",
    hackathonId: "comp-2",
    imageUrl: "https://i.ibb.co/YBcT9Bw8/IMG-20260906-WA0009.jpg"
  },
  {
    id: "proj-pathpilot",
    title: "PathPilot AI",
    role: "Backend dev",
    description: "An intelligent career guidance system providing personalized roadmaps for students and professionals.",
    longDescription: "An intelligent career guidance system providing personalized roadmaps for students and professionals. Developed during the Aethronix Hackathon (Samavarthan 2k26) at MVSR College, powering backend roadmap engines, data models, and adaptive recommendation APIs.",
    category: "AI & Tools",
    tags: ["Node.js", "AI Roadmaps", "Backend", "Career Guidance", "Samavarthan 2k26"],
    featured: true,
    metrics: "Aethronix Hackathon",
    githubUrl: "https://github.com/harshil-kamc/pathpilot-ai",
    demoUrl: "https://pathpilot-ai-ixzl.onrender.com/#",
    hackathonName: "Aethronix Hackathon (Samavarthan 2k26)",
    hackathonId: "comp-8",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "proj-localoop",
    title: "Localoop",
    role: "Full Stack dev",
    description: "A dynamic platform bridging the gap between citizens and local governance for seamless communication.",
    longDescription: "A dynamic platform bridging the gap between citizens and local governance for seamless communication. Engineered during CodeSangram Online Hackathon by Quizcred & Unstop, creating full-stack community issue logging, verification, and civic engagement pipelines.",
    category: "Full Stack",
    tags: ["Full Stack", "Civic Tech", "Local Governance", "Community", "CodeSangram"],
    featured: true,
    metrics: "CodeSangram Hackathon",
    githubUrl: "https://github.com/harshil-kamc/LocaLoop",
    hackathonName: "CodeSangram Online Hackathon",
    hackathonId: "comp-3",
    imageUrl: "https://i.ibb.co/qL8bww5T/IMG-20260912-WA0003.jpg",
    screenshots: [
      "https://i.ibb.co/qL8bww5T/IMG-20260912-WA0003.jpg",
      "https://i.ibb.co/TMVFz1z4/IMG-20260912-WA0010.jpg",
      "https://i.ibb.co/bgcmDZBX/IMG-20260912-WA0009.jpg",
      "https://i.ibb.co/zh34XT7L/IMG-20260912-WA0008.jpg",
      "https://i.ibb.co/N6g90kR8/IMG-20260912-WA0007.jpg",
      "https://i.ibb.co/prPvPdDK/IMG-20260912-WA0006.jpg",
      "https://i.ibb.co/rRG2dxV7/IMG-20260912-WA0005.jpg",
      "https://i.ibb.co/pvHFgt70/IMG-20260912-WA0004.jpg"
    ]
  },
  {
    id: "proj-truthnova",
    title: "TruthNova",
    role: "Frontend dev",
    description: "Comprehensive Fake news detection and analysis system built to ensure information integrity.",
    longDescription: "Comprehensive Fake news detection and analysis system built to ensure information integrity. Developed during the GeeksForGeeks Hackfest at GFG Madhapur, successfully solving the official GFG problem statement to win 1st Prize.",
    category: "AI & Tools",
    tags: ["Frontend", "NLP", "Fake News Detection", "1st Prize", "GFG Hackfest"],
    featured: true,
    metrics: "1st Prize Winner",
    hackathonName: "GFG Hackfest (1st Prize Winner)",
    hackathonId: "comp-5",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "proj-orbithire",
    title: "OrbitHire",
    role: "Frontend dev",
    description: "A robust full-stack platform tailored for job seekers to connect efficiently with employers.",
    longDescription: "A robust full-stack platform tailored for job seekers to connect efficiently with employers. Engineered during Forge Inspira 2026 at IIT Hyderabad, featuring streamlined candidate workflows and talent-matching UI.",
    category: "Full Stack",
    tags: ["Frontend", "Recruitment Hub", "Job Seeker Platform", "IIT Hyderabad", "Forge Inspira"],
    featured: false,
    metrics: "Forge Inspira (IIT-H)",
    hackathonName: "Forge Inspira 2026",
    hackathonId: "comp-6",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "proj-loan-risk",
    title: "AI Loan Lending Risk",
    role: "Full Stack dev",
    description: "Predictive analysis model assessing credit risk for applicants using advanced algorithms.",
    longDescription: "Predictive analysis model assessing credit risk for applicants using advanced algorithms. Created during the National AI/ML Hackathon by Vivriti Capital and Yuvaan, IIT Hyderabad.",
    category: "AI & Tools",
    tags: ["Full Stack", "Predictive Analytics", "Credit Risk", "Machine Learning", "Vivriti Hackathon"],
    featured: false,
    metrics: "National AI/ML Hackathon",
    hackathonName: "National AI/ML Hackathon",
    hackathonId: "comp-4",
    imageUrl: "https://i.ibb.co/TDzy8Sj5/image.png",
    screenshots: [
      "https://i.ibb.co/TDzy8Sj5/image.png"
    ]
  },
  {
    id: "proj-clock",
    title: "Analog Clock using MATLAB",
    role: "MATLAB Developer",
    description: "A visually accurate and programmed analog clock interface designed purely utilizing MATLAB scripting.",
    longDescription: "A visually accurate and programmed analog clock interface designed purely utilizing MATLAB scripting with mathematical precision, trigonometric hand rotation transforms, and real-time refresh rendering.",
    category: "Web & Interactive",
    tags: ["MATLAB", "Scripting", "Mathematical Simulation", "Graphics"],
    featured: false,
    metrics: "Mathematical Simulation",
    isOther: true,
    imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
  }
];

export type SkillGroup = "Languages" | "Web" | "Backend" | "Data" | "Foundations" | "Security" | "Tools";

export const SKILL_GROUP_COLORS: Record<SkillGroup, string> = {
  Languages: "#00F0FF",
  Web: "#A78BFA",
  Backend: "#34D399",
  Data: "#FBBF24",
  Foundations: "#F472B6",
  Security: "#F87171",
  Tools: "#94A3B8",
};

/** Where a skill has actually been used: a project id, a competition id, or this site itself */
export type SkillEvidence =
  | { kind: "project"; id: string }
  | { kind: "event"; id: string }
  | { kind: "site"; label: string };

export interface Skill {
  /** Two-letter tile symbol, periodic-table style */
  symbol: string;
  name: string;
  group: SkillGroup;
  summary: string;
  usedIn: SkillEvidence[];
}

export const SKILLS: Skill[] = [
  {
    symbol: "C",
    name: "C",
    group: "Languages",
    summary: "Low-level programming, memory management and pointer arithmetic.",
    usedIn: [],
  },
  {
    symbol: "Py",
    name: "Python",
    group: "Languages",
    summary: "Scripting, algorithmic solutions and modular programs.",
    usedIn: [],
  },
  {
    symbol: "Ja",
    name: "Java",
    group: "Languages",
    summary: "Object-oriented programming with classes and the standard library.",
    usedIn: [],
  },
  {
    symbol: "Ts",
    name: "TypeScript",
    group: "Languages",
    summary: "Typed JavaScript across a React frontend and a Node server.",
    usedIn: [{ kind: "site", label: "This portfolio, front to back" }],
  },
  {
    symbol: "Ht",
    name: "HTML",
    group: "Web",
    summary: "Semantic structure, the DOM and accessible markup.",
    usedIn: [{ kind: "site", label: "This portfolio" }],
  },
  {
    symbol: "Cs",
    name: "CSS",
    group: "Web",
    summary: "Responsive layouts, 3D transforms and motion.",
    usedIn: [{ kind: "site", label: "This portfolio, including the flipbook" }],
  },
  {
    symbol: "Re",
    name: "React",
    group: "Web",
    summary: "Component-driven interfaces with hooks and state.",
    usedIn: [
      { kind: "project", id: "proj-deepsafe" },
      { kind: "site", label: "This portfolio" },
    ],
  },
  {
    symbol: "Tw",
    name: "Tailwind CSS",
    group: "Web",
    summary: "Utility-first styling for fast, consistent UI.",
    usedIn: [{ kind: "site", label: "This portfolio" }],
  },
  {
    symbol: "Cv",
    name: "Canvas API",
    group: "Web",
    summary: "Real-time 2D rendering: the particle engine behind this site.",
    usedIn: [{ kind: "site", label: "The particle engine on this page" }],
  },
  {
    symbol: "Nd",
    name: "Node.js",
    group: "Backend",
    summary: "Server-side JavaScript for APIs and recommendation logic.",
    usedIn: [
      { kind: "project", id: "proj-pathpilot" },
      { kind: "site", label: "This portfolio's server" },
    ],
  },
  {
    symbol: "Ex",
    name: "Express",
    group: "Backend",
    summary: "HTTP routing and middleware for small, focused APIs.",
    usedIn: [{ kind: "site", label: "This portfolio's visitor-alert API" }],
  },
  {
    symbol: "Sq",
    name: "SQL",
    group: "Data",
    summary: "Queries, joins, aggregations and indexing.",
    usedIn: [],
  },
  {
    symbol: "Db",
    name: "RDBMS",
    group: "Data",
    summary: "Relational models, normalisation and integrity rules.",
    usedIn: [],
  },
  {
    symbol: "Ds",
    name: "DSA",
    group: "Foundations",
    summary: "Data structures, complexity analysis and algorithmic problem solving.",
    usedIn: [],
  },
  {
    symbol: "Sc",
    name: "Security & CTF",
    group: "Security",
    summary: "Reverse engineering, web exploitation and cryptography under time pressure.",
    usedIn: [
      { kind: "event", id: "comp-1" },
      { kind: "event", id: "comp-9" },
    ],
  },
  {
    symbol: "Gt",
    name: "Git & GitHub",
    group: "Tools",
    summary: "Version control and collaboration during hackathon sprints.",
    usedIn: [
      { kind: "project", id: "proj-deepsafe" },
      { kind: "project", id: "proj-pathpilot" },
      { kind: "project", id: "proj-localoop" },
    ],
  },
  {
    symbol: "Ml",
    name: "MATLAB",
    group: "Tools",
    summary: "Numerical scripting and graphics with trigonometric transforms.",
    usedIn: [{ kind: "project", id: "proj-clock" }],
  },
];

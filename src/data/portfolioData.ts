import { Project, ExperienceItem, SkillCategory, EducationItem, Competition } from "../types/portfolio";

export const EDUCATION_DATA: EducationItem[] = [
  {
    qualification: "Bachelor of Engineering",
    fieldStream: "Computer Science & Information Technology (CSIT)",
    institution: "MVSR Engineering College",
    duration: "2024 – 2028\n(Currently Pursuing)",
    gpa: "-"
  },
  {
    qualification: "Intermediate",
    fieldStream: "MPC",
    institution: "Narayana Junior College",
    duration: "2022 – 2024",
    gpa: "9.39"
  },
  {
    qualification: "S.S.C",
    fieldStream: "State Board",
    institution: "Bhashyam High School",
    duration: "May 2022",
    gpa: "9.3"
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

export const COMPETITIONS_LIST: Competition[] = [
  {
    id: "comp-1",
    title: "IEEE Cyber Ektha CTF Hackathon",
    organizer: "MVSR Engineering College & IEEE",
    venue: "MVSR Engineering College",
    date: "5th – 6th December 2025",
    duration: "24 Hours Offline",
    teamName: "Digital Piece",
    type: "CTF Hackathon",
    result: "1st Place Winner 🏆",
    isWinner: true,
    awardRank: "1st",
    description: "A 24-hour intense Capture The Flag (CTF) cybersecurity hackathon conducted at MVSR Engineering College. Me and my team (Digital Piece) tackled challenging reverse engineering, web exploitation, network forensics, and cryptography challenges, successfully securing 1st place.",
    projectOrFocus: "Reverse Engineering, Web Exploitation & Cryptography",
    certificateUrl: "https://drive.google.com/file/d/15VaArUe63LCN3V8rYNDbmTbmMgtcf5BE/view?usp=drive_link",
    tags: ["1st Place", "CTF", "Cybersecurity", "24hr Hackathon", "IEEE", "Digital Piece"]
  },
  {
    id: "comp-2",
    title: "IEEE TKR Hackconquest",
    organizer: "TKR Engineering College & IEEE",
    venue: "TKR Engineering College",
    date: "27th – 28th February 2026",
    duration: "24 Hours Offline",
    teamName: "Digital Piece",
    type: "Offline Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "A 24-hour offline hackathon conducted at TKR Engineering College. Built the DeepSafe project with team Digital Piece, collaborating on high-speed ideation, software architecture design, and rapid sprint prototyping.",
    projectOrFocus: "DeepSafe — AI-Powered Media Analysis System",
    projectId: "proj-deepsafe",
    projectName: "DeepSafe",
    projectRole: "Frontend dev",
    certificateUrl: "https://drive.google.com/file/d/1XyQZIW7M9b_6idwH1eGQdj4cMZjalrdu/view?usp=drive_link",
    tags: ["Offline Hackathon", "24hr Sprint", "IEEE", "Digital Piece", "DeepSafe"]
  },
  {
    id: "comp-3",
    title: "CodeSangram Online Hackathon",
    organizer: "Quizcred & Unstop",
    venue: "Online",
    date: "17th - 28th February 2026",
    duration: "Multi-Round Online Sprint",
    teamName: "Digital Piece",
    type: "Online Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "An online hackathon organized by Unstop and Quizcred. Engineered the Localoop platform with team Digital Piece, solving competitive problem statements for seamless community-government interaction.",
    projectOrFocus: "Localoop — Citizen & Governance Connecting Platform",
    projectId: "proj-localoop",
    projectName: "Localoop",
    projectRole: "Full Stack dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["Online Hackathon", "Unstop", "Quizcred", "Digital Piece", "Localoop"]
  },
  {
    id: "comp-4",
    title: "National AI/ML Hackathon",
    organizer: "Vivriti Capital, Yuvaan & Unstop",
    venue: "Online",
    date: "18th Feb – 22nd March 2026",
    duration: "Month-long Hackathon",
    teamName: "Digital Piece",
    type: "Online Hackathon",
    result: "National Participant",
    awardRank: "Participant",
    description: "A competitive national-level AI/ML hackathon organized by Vivriti Capital, Yuvaan, and Unstop. Built the AI Loan Lending Risk predictive model assessing credit risk for applicants using advanced algorithms with team Digital Piece.",
    projectOrFocus: "AI Loan Lending Risk — Predictive Credit Assessment Model",
    projectId: "proj-loan-risk",
    projectName: "AI Loan Lending Risk",
    projectRole: "Full Stack dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["AI/ML", "Vivriti Capital", "Yuvaan", "Unstop", "Data Science", "Digital Piece"]
  },
  {
    id: "comp-5",
    title: "GFG Hackfest",
    organizer: "GeeksForGeeks (GFG)",
    venue: "GFG Institution, Madhapur",
    date: "10th – 17th March 2026",
    duration: "1-Week Hackfest (Onsite Finale)",
    teamName: "Digital Piece",
    type: "Offline Hackathon",
    result: "1st Prize Winner 🏆",
    isWinner: true,
    awardRank: "1st",
    description: "A prestigious hackathon organized by GeeksForGeeks at the GFG Institution in Madhapur. Engineered TruthNova — a comprehensive fake news detection and analysis system. Submitted and defended live on 17th March, securing 1st Prize.",
    projectOrFocus: "TruthNova — Fake News Detection & Analysis System (1st Prize)",
    projectId: "proj-truthnova",
    projectName: "TruthNova",
    projectRole: "Frontend dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["1st Prize", "GeeksForGeeks", "GFG Madhapur", "TruthNova", "Digital Piece"]
  },
  {
    id: "comp-6",
    title: "Forge Inspira 2026",
    organizer: "Forge Alumnus & IIT Hyderabad",
    venue: "IIT Hyderabad",
    date: "27th – 29th March 2026",
    duration: "24 Hours Offline",
    teamName: "Digital Piece",
    type: "Offline Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "An intensive 24-hour offline hackathon hosted at IIT Hyderabad by Forge Alumnus as part of Forge Inspira 2026. Developed OrbitHire — a full-stack platform tailored for job seekers to connect with employers with team Digital Piece.",
    projectOrFocus: "OrbitHire — Job Seeker & Employer Connection Platform",
    projectId: "proj-orbithire",
    projectName: "OrbitHire",
    projectRole: "Frontend dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["IIT Hyderabad", "Forge Inspira", "OrbitHire", "24hr Hackathon", "Digital Piece"]
  },
  {
    id: "comp-7",
    title: "MYBHARAT Budget Quest 2026",
    organizer: "Ministry of Youth Affairs / MyBharat, Govt. of India",
    venue: "Kanha Shanti Vanam, Hyderabad",
    date: "12th – 13th April 2026",
    duration: "National Multi-Round Summit",
    teamName: "Individual Representation",
    type: "National Competition",
    result: "Telangana State Winner 🌟 (Top 500 from 12+ Lakh Participants)",
    isWinner: true,
    awardRank: "Winner",
    description: "A nationwide competitive event with over 12 Lakh (1.2+ Million) participants across India. Participated and won across both the national budget quiz and policy essay rounds, emerging as a Telangana State Winner (among 500+ state winners). Attended the prestigious Budget Quest program held at Kanha Shanti Vanam on 12-13th April.",
    projectOrFocus: "National Budget Policy Essay & Grand Quiz Rounds",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["State Winner", "MyBharat", "National Honor", "12+ Lakh Participants", "Govt of India"]
  },
  {
    id: "comp-8",
    title: "Aethronix Hackathon (Samavarthan 2k26)",
    organizer: "MVSR Engineering College",
    venue: "MVSR Engineering College",
    date: "17th – 18th April 2026",
    duration: "24 Hours Offline",
    teamName: "Digital Piece",
    type: "Offline Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "A 24-hour offline hackathon organized as part of the Samavarthan 2k26 national technical symposium at MVSR Engineering College. Developed PathPilot AI — an intelligent career guidance system with team Digital Piece.",
    projectOrFocus: "PathPilot AI — Career Guidance & Roadmap Platform",
    projectId: "proj-pathpilot",
    projectName: "PathPilot AI",
    projectRole: "Backend dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["24hr Hackathon", "MVSR College", "PathPilot AI", "Samavarthan 2k26", "Digital Piece"]
  },
  {
    id: "comp-9",
    title: "Secleaf Q2 CTF 2026",
    organizer: "Secleaf",
    venue: "International / Online",
    date: "23rd – 24th May 2026",
    duration: "24 Hours",
    teamName: "Ctrl Alt Del",
    type: "CTF Hackathon",
    result: "International CTF Participant",
    awardRank: "Participant",
    description: "A 24-hour international online CTF cybersecurity hackathon conducted by Secleaf. Competed in team Ctrl Alt Del, cracking challenges in cryptography, binary exploitation, web security, and network defenses.",
    projectOrFocus: "International Cybersecurity & CTF Exploitation",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["International CTF", "Secleaf", "Cybersecurity", "Ctrl Alt Del", "24hr CTF"]
  }
];

export const HARSHIL_BIO = {
  name: "Harshil",
  fullName: "HARSHIL KAMCHETTY",
  role: "Student Developer & Creative Technologist",
  tagline: "Crafting interactive web experiences, algorithms, and high-performance applications with code & pixels.",
  aboutText: `I am a computer science student with a deep fascination for interactive graphics, full-stack systems, and elegant user interfaces. I love taking complex technical challenges and turning them into intuitive, visually fluid digital experiences.`,
  location: "Meerpet,500097",
  phone: "+91 6304654185",
  email: "Harshilkamc@gmail.com",
  portfolioUrl: "https://harshil-kamc.github.io/Portfolio/",
  education: "B.E. in CSIT (MVSR Engineering College)",
  github: "https://github.com/harshil-kamc",
  linkedin: "https://in.linkedin.com/in/harshil-kamchetty-170a473bb",
  careerObjective: "Motivated and detail-oriented student pursuing a Engineering Degree with strong academic performance and a passion for Computer Science field. Eager to apply theoretical knowledge to real-world challenges, contribute to team success, and develop professional skills in a dynamic work environment.",
  stats: [
    { label: "Projects Completed", value: "8+" },
    { label: "Competitions & Hackathons", value: "9" },
    { label: "1st Place & State Wins", value: "3" },
    { label: "Academic Excellence", value: "9.39 GPA" },
  ]
};

export const DEFAULT_PARTICLE_IMAGES = [
  "https://i.ibb.co/8DpK0v51/264511853.png", 
  "https://i.ibb.co/Rpjb0WL5/image-Photoroom.png",
  "https://i.ibb.co/8DpK0v51/264511853.png",
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Full-Stack Developer Intern",
    company: "NextGen Tech Solutions",
    period: "2025 - Present",
    location: "Remote",
    description: [
      "Engineered high-throughput REST APIs and real-time dashboard analytics using Node.js and React.",
      "Optimized client-side rendering performance by 40% using canvas-based custom visualizations and virtualized lists.",
      "Collaborated with UI/UX designers to implement pixel-perfect dark mode themes and accessible design tokens."
    ],
    skills: ["TypeScript", "React", "Node.js", "Canvas API", "Tailwind CSS"]
  },
  {
    id: "exp-2",
    role: "Student Tech Lead & Mentor",
    company: "University Computer Science Club",
    period: "2024 - 2025",
    location: "Campus",
    description: [
      "Led weekly technical workshops teaching web development, algorithms, and version control to 80+ students.",
      "Architected the annual hackathon portal platform, handling concurrent registrations and live scoring.",
      "Mentored junior developers in building open-source projects and mastering modern JavaScript."
    ],
    skills: ["JavaScript", "Python", "Git", "Community Leadership", "System Design"]
  },
  {
    id: "exp-3",
    role: "Open Source Contributor",
    company: "Community Projects",
    period: "2023 - Present",
    location: "Global",
    description: [
      "Contributed bug fixes and performance enhancements to popular frontend and developer tooling repositories.",
      "Created reusable canvas particle components and UI micro-interaction libraries for web developers."
    ],
    skills: ["TypeScript", "Open Source", "Vite", "Canvas", "Performance Tuning"]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "proj-deepsafe",
    title: "DeepSafe",
    role: "Frontend dev",
    description: "An AI-powered system designed to identify and analyze synthetic media to combat misinformation online.",
    longDescription: "An AI-powered system designed to identify and analyze synthetic media to combat misinformation online. Built during the IEEE TKR Hackconquest 24-hr hackathon with team Digital Piece, focusing on real-time spatial and facial forgery detection interface workflows.",
    category: "Full Stack",
    tags: ["React", "AI Detection", "Frontend", "Synthetic Media", "TKR Hackconquest"],
    featured: true,
    metrics: "IEEE TKR Hackathon",
    githubUrl: "https://github.com/harshil-kamc/DeepSafe",
    demoUrl: "https://deepsafe-dp.netlify.app/",
    hackathonName: "IEEE TKR Hackconquest",
    hackathonId: "comp-2"
  },
  {
    id: "proj-pathpilot",
    title: "PathPilot AI",
    role: "Backend dev",
    description: "An intelligent career guidance system providing personalized roadmaps for students and professionals.",
    longDescription: "An intelligent career guidance system providing personalized roadmaps for students and professionals. Developed during the Aethronix Hackathon (Samavarthan 2k26) at MVSR College with team Digital Piece, powering backend roadmap engines, data models, and adaptive recommendation APIs.",
    category: "AI & Tools",
    tags: ["Node.js", "AI Roadmaps", "Backend", "Career Guidance", "Samavarthan 2k26"],
    featured: true,
    metrics: "Aethronix Hackathon",
    githubUrl: "https://github.com/harshil-kamc/pathpilot-ai",
    demoUrl: "https://pathpilot-ai-ixzl.onrender.com/#",
    hackathonName: "Aethronix Hackathon (Samavarthan 2k26)",
    hackathonId: "comp-8"
  },
  {
    id: "proj-localoop",
    title: "Localoop",
    role: "Full Stack dev",
    description: "A dynamic platform bridging the gap between citizens and local governance for seamless communication.",
    longDescription: "A dynamic platform bridging the gap between citizens and local governance for seamless communication. Engineered during CodeSangram Online Hackathon by Quizcred & Unstop with team Digital Piece, creating full-stack community issue logging, verification, and civic engagement pipelines.",
    category: "Full Stack",
    tags: ["Full Stack", "Civic Tech", "Local Governance", "Community", "CodeSangram"],
    featured: true,
    metrics: "CodeSangram Hackathon",
    githubUrl: "https://github.com/harshil-kamc/LocaLoop",
    hackathonName: "CodeSangram Online Hackathon",
    hackathonId: "comp-3"
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
    metrics: "1st Prize Winner 🏆",
    hackathonName: "GFG Hackfest (1st Prize Winner)",
    hackathonId: "comp-5"
  },
  {
    id: "proj-orbithire",
    title: "OrbitHire",
    role: "Frontend dev",
    description: "A robust full-stack platform tailored for job seekers to connect efficiently with employers.",
    longDescription: "A robust full-stack platform tailored for job seekers to connect efficiently with employers. Engineered during Forge Inspira 2026 at IIT Hyderabad with team Digital Piece, featuring streamlined candidate workflows and talent-matching UI.",
    category: "Full Stack",
    tags: ["Frontend", "Recruitment Hub", "Job Seeker Platform", "IIT Hyderabad", "Forge Inspira"],
    featured: false,
    metrics: "Forge Inspira (IIT-H)",
    hackathonName: "Forge Inspira 2026",
    hackathonId: "comp-6"
  },
  {
    id: "proj-loan-risk",
    title: "AI Loan Lending Risk",
    role: "Full Stack dev",
    description: "Predictive analysis model assessing credit risk for applicants using advanced algorithms.",
    longDescription: "Predictive analysis model assessing credit risk for applicants using advanced algorithms. Created during the National AI/ML Hackathon by Vivriti Capital, Yuvaan & Unstop with team Digital Piece.",
    category: "AI & Tools",
    tags: ["Full Stack", "Predictive Analytics", "Credit Risk", "Machine Learning", "Vivriti Hackathon"],
    featured: false,
    metrics: "National AI/ML Hackathon",
    hackathonName: "National AI/ML Hackathon",
    hackathonId: "comp-4"
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
    isOther: true
  }
];

export interface TechnicalSkill {
  name: string;
  tagline: string;
  level: number;
  highlight: string;
}

export const TECHNICAL_SKILLS: TechnicalSkill[] = [
  {
    name: "C",
    tagline: "Low-level programming, memory management & pointer arithmetic",
    level: 90,
    highlight: "Core Systems"
  },
  {
    name: "Python",
    tagline: "Scripting, algorithmic solutions & modular programming",
    level: 88,
    highlight: "Scripting & Dev"
  },
  {
    name: "DSA",
    tagline: "Data structures, time complexity analysis & algorithmic logic",
    level: 92,
    highlight: "Problem Solving"
  },
  {
    name: "Java",
    tagline: "Object-oriented programming, classes & standard library",
    level: 86,
    highlight: "OOP Architecture"
  },
  {
    name: "HTML",
    tagline: "Semantic structuring, DOM elements & accessibility",
    level: 94,
    highlight: "Web Structure"
  },
  {
    name: "CSS",
    tagline: "Responsive layouts, styling, flexbox & modern animations",
    level: 88,
    highlight: "Styling & UI"
  },
  {
    name: "RDBMS",
    tagline: "Relational database models, normalization & integrity rules",
    level: 85,
    highlight: "Data Modeling"
  },
  {
    name: "SQL",
    tagline: "Queries, joins, aggregations, indexing & data manipulation",
    level: 88,
    highlight: "Database Queries"
  }
];


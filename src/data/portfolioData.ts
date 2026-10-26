import { Project, SkillCategory, EducationItem, Competition } from "../types/portfolio";
import { PageFlipLeaf } from "../components/lightswind/3d-image-pageflip";

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
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    title: "IEEE Cyber Ektha CTF Hackathon",
    organizer: "MVSR Engineering College & IEEE",
    venue: "MVSR Engineering College",
    date: "5th – 6th December 2025",
    duration: "24 Hours Offline",
    type: "CTF Hackathon",
    result: "Team Participation",
    awardRank: "1st",
    description: "A 24-hour intense Capture The Flag (CTF) cybersecurity hackathon conducted at MVSR Engineering College. Tackled challenging reverse engineering, web exploitation, network forensics, and cryptography challenges, successfully securing 1st place.",
    projectOrFocus: "Reverse Engineering, Web Exploitation & Cryptography",
    certificateUrl: "https://drive.google.com/file/d/15VaArUe63LCN3V8rYNDbmTbmMgtcf5BE/view?usp=drive_link",
    tags: [ "CTF", "Cybersecurity", "24hr Hackathon", "IEEE"]
  },
  {
    id: "comp-2",
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
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80",
    title: "CodeSangram Online Hackathon",
    organizer: "Quizcred & Unstop",
    venue: "Online",
    date: "17th - 28th February 2026",
    duration: "Multi-Round Online Sprint",
    type: "Online Hackathon",
    result: "Team Participation",
    awardRank: "Participant",
    description: "An online hackathon organized by Unstop and Quizcred. Engineered the Localoop platform, solving competitive problem statements for seamless community-government interaction.",
    projectOrFocus: "Localoop — Citizen & Governance Connecting Platform",
    projectId: "proj-localoop",
    projectName: "Localoop",
    projectRole: "Full Stack dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["Online Hackathon", "Unstop", "Quizcred", "Localoop"]
  },
  {
    id: "comp-4",
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    title: "National AI/ML Hackathon",
    organizer: "Vivriti Capital, Yuvaan & Unstop",
    venue: "Online",
    date: "18th Feb – 22nd March 2026",
    duration: "Month-long Hackathon",
    type: "Online Hackathon",
    result: "National Participant",
    awardRank: "Participant",
    description: "A competitive national-level AI/ML hackathon organized by Vivriti Capital, Yuvaan, and Unstop. Built the AI Loan Lending Risk predictive model assessing credit risk for applicants using advanced algorithms.",
    projectOrFocus: "AI Loan Lending Risk — Predictive Credit Assessment Model",
    projectId: "proj-loan-risk",
    projectName: "AI Loan Lending Risk",
    projectRole: "Full Stack dev",
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["AI/ML", "Vivriti Capital", "Yuvaan", "Unstop", "Data Science"]
  },
  {
    id: "comp-5",
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    title: "GFG Hackfest",
    organizer: "GeeksForGeeks (GFG)",
    venue: "GFG Institution, Madhapur",
    date: "10th – 17th March 2026",
    duration: "1-Week Hackfest (Onsite Finale)",
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
    tags: ["1st Prize", "GeeksForGeeks", "GFG Madhapur", "TruthNova"]
  },
  {
    id: "comp-6",
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
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
    certificateUrl: "https://drive.google.com/drive/folders/1kW6fo5xuhR7x9GVtyD-cKEr3H2yylgPt",
    tags: ["IIT Hyderabad", "Forge Inspira", "OrbitHire", "24hr Hackathon"]
  },
  {
    id: "comp-7",
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
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
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
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
    // Placeholder stock photo: replace with a real event photo (e.g. an imgbb link)
    coverImage: "https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=1000&q=80",
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

// Chronological 3D Flipbook Magazine leaves for hackathons & competitions
// Sample images configured; user will provide direct competition images in the future
export const COMPETITION_FLIPBOOK_PAGES: PageFlipLeaf[] = [
  {
    frontImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    frontTitle: "Hackathon Chronicles",
    frontSubtitle: "Chronological Journey of 9 Hackathons, Sprints & Trophies",
    frontBadge: "Cover • Vol 01",
    backImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    backTitle: "1. IEEE Cyber Ektha CTF",
    backSubtitle: "MVSR Engineering College • 1st Place Winner ",
    backBadge: "Dec 2025 • CTF",
    backData: COMPETITIONS_LIST[0], 
  },
  {
    frontImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    frontTitle: "2. CodeSangram Hackathon",
    frontSubtitle: "Quizcred & Unstop • Localoop Platform",
    frontBadge: "Feb 2026 • Civic Tech",
    frontData: COMPETITIONS_LIST[2], // comp-3 (CodeSangram: 17th Feb 2026)
    backImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    backTitle: "3. National AI/ML Hackathon",
    backSubtitle: "Vivriti Capital & Yuvaan • Credit Risk AI",
    backBadge: "Feb 2026 • AI/ML",
    backData: COMPETITIONS_LIST[3], // comp-4 (National AI/ML: 18th Feb 2026)
  },
  {
    frontImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    frontTitle: "4. IEEE TKR Hackconquest",
    frontSubtitle: "TKR Engineering College • DeepSafe Analyzer",
    frontBadge: "Feb 2026 • 24hr Sprint",
    frontData: COMPETITIONS_LIST[1], // comp-2 (IEEE TKR: 27th Feb 2026)
    backImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    backTitle: "5. GFG Hackfest — 1st Prize ",
    backSubtitle: "GeeksForGeeks Madhapur • TruthNova Fake News Detector",
    backBadge: "Mar 2026 • 1st Prize",
    backData: COMPETITIONS_LIST[4], // comp-5 (GFG Hackfest: 10th Mar 2026)
  },
  {
    frontImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    frontTitle: "6. Forge Inspira 2026",
    frontSubtitle: "IIT Hyderabad • OrbitHire Job Platform",
    frontBadge: "Mar 2026 • IIT-H",
    frontData: COMPETITIONS_LIST[5], // comp-6 (Forge Inspira: 27th Mar 2026)
    backImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    backTitle: "7. MYBHARAT Budget Quest ",
    backSubtitle: "Ministry of Youth Affairs • Telangana State Winner",
    backBadge: "Apr 2026 • State Winner",
    backData: COMPETITIONS_LIST[6], // comp-7 (MYBHARAT: 12th Apr 2026)
  },
  {
    frontImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    frontTitle: "8. Aethronix Hackathon",
    frontSubtitle: "Samavarthan 2k26 • PathPilot AI Career Guidance",
    frontBadge: "Apr 2026 • AI Career",
    frontData: COMPETITIONS_LIST[7], // comp-8 (Aethronix: 17th Apr 2026)
    backImage: "https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=800&q=80",
    backTitle: "9. Secleaf Q2 CTF 2026",
    backSubtitle: "International CTF • Binary Exploitation & Crypto",
    backBadge: "May 2026 • Cyber CTF",
    backData: COMPETITIONS_LIST[8], // comp-9 (Secleaf CTF: 23rd May 2026)
  },
  {
    frontImage: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    frontTitle: "Milestones & Achievements",
    frontSubtitle: "9 Hackathons Completed • 3 Winner Honors • 9.39 GPA",
    frontBadge: "Summary",
    frontData: {
      id: "comp-summary",
      title: "Hackathon Track Record & Milestones",
      organizer: "Collegiate & National Circuit",
      venue: "Hyderabad, Telangana & National",
      date: "Dec 2025 – May 2026",
      duration: "6 Months Intensive",
      type: "Competition Portfolio",
      result: "9 Hackathons • 3 Podium Wins",
      isWinner: true,
      awardRank: "1st",
      description: "Comprehensive track record across 9 competitive hackathons and CTFs in 6 months, building civic tech platforms (Localoop), credit risk AI models, deepfake analyzers (DeepSafe), fake news detectors (TruthNova), AI hiring platforms (OrbitHire), and career guides (PathPilot AI).",
      certificateUrl: COMPETITION_CERTIFICATES_DRIVE_URL,
      tags: ["9 Hackathons", "3 Wins", "Civic Tech", "AI/ML", "Cybersecurity"]
    },
    backImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    backTitle: "Certificate Vault",
    backSubtitle: "Official Google Drive Certificate Archive & Verification",
    backBadge: "Back Cover",
    backData: {
      id: "comp-vault",
      title: "Official Certificate Archive & Verification",
      organizer: "Google Drive Cloud Vault",
      venue: "Drive Folder (Cloud Verified)",
      date: "Dec 2025 – Present",
      duration: "All-Time",
      type: "Official Certificates",
      result: "Verified Certificates & Honors",
      isWinner: true,
      description: "Direct cloud repository hosting high-resolution certificates of merit, winner awards, certificates of participation, and verification records across all 9 hackathons and collegiate technical events.",
      certificateUrl: COMPETITION_CERTIFICATES_DRIVE_URL,
      tags: ["Certificates", "Drive Archive", "Verification", "Proof of Work"]
    }
  },
];

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
    { label: "Projects Completed", value: "8+" },
    { label: "Competitions & Hackathons", value: "9" },
    { label: "1st Place & State Wins", value: "3" },
    { label: "Intermediate (MPC) Score", value: "9.39" },
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
    metrics: "1st Prize Winner 🏆",
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
    longDescription: "Predictive analysis model assessing credit risk for applicants using advanced algorithms. Created during the National AI/ML Hackathon by Vivriti Capital, Yuvaan & Unstop.",
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


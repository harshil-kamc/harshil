import { Project, ExperienceItem, SkillCategory } from "../types/portfolio";

export const HARSHIL_BIO = {
  name: "Harshil",
  role: "Student Developer & Creative Technologist",
  tagline: "Crafting interactive web experiences, algorithms, and high-performance applications with code & pixels.",
  aboutText: `I am a computer science student with a deep fascination for interactive graphics, full-stack systems, and elegant user interfaces. I love taking complex technical challenges and turning them into intuitive, visually fluid digital experiences.`,
  location: "Global / Remote",
  education: "B.S. in Computer Science (Student)",
  email: "harshil.dev@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  stats: [
    { label: "Projects Completed", value: "15+" },
    { label: "Algorithms Mastered", value: "300+" },
    { label: "Core Technologies", value: "8+" },
    { label: "Coffee Consumed", value: "∞" },
  ]
};

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
    id: "proj-1",
    title: "Particle Canvas Typography Engine",
    description: "An interactive, physics-based canvas particle text engine that morphs text into fluid particles with dynamic vector steering.",
    longDescription: "Built with pure HTML5 Canvas API and TypeScript, this engine converts text string vectors into pixel target coordinates. Particles use spring forces and steering behavior to smoothly morph between words while responding to mouse inputs.",
    category: "Web & Interactive",
    tags: ["TypeScript", "HTML5 Canvas", "Physics Simulation", "React"],
    featured: true,
    metrics: "60 FPS Render Loop"
  },
  {
    id: "proj-2",
    title: "AI Workspace & Code Companion",
    description: "Smart developer studio integrating LLM reasoning for real-time code snippet generation and automated refactoring.",
    longDescription: "An end-to-end full-stack web application powered by Gemini API that offers context-aware code analysis, instant unit test generation, and intelligent markdown preview.",
    category: "AI & Tools",
    tags: ["React", "Express", "Gemini API", "Tailwind CSS"],
    featured: true,
    metrics: "1,200+ Snippets Generated"
  },
  {
    id: "proj-3",
    title: "Real-time Graph & Algorithm Visualizer",
    description: "Interactive visualizer for pathfinding, graph traversal (Dijkstra, A*), and sorting algorithms with step-by-step playback.",
    longDescription: "Designed to help students visualize complex computer science algorithms. Supports customizable speed, obstacle drawing, and step-by-step execution metrics.",
    category: "Web & Interactive",
    tags: ["React", "Algorithms", "Data Structures", "Motion"],
    featured: true,
    metrics: "12+ Algorithms Supported"
  },
  {
    id: "proj-4",
    title: "Full-Stack Task & Event Orchestrator",
    description: "Responsive web application with drag-and-drop workflow boards, time tracking, and analytics dashboards.",
    longDescription: "Features real-time state synchronization, local fallback storage, custom status channels, and automated progress metrics calculation.",
    category: "Full Stack",
    tags: ["React", "Node.js", "Express", "Tailwind CSS"],
    featured: false,
    metrics: "Sub-100ms Latency"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend & Interactive Graphics",
    skills: [
      { name: "TypeScript / JavaScript", level: 92 },
      { name: "React / Vite", level: 90 },
      { name: "HTML5 Canvas / WebGL Basics", level: 88 },
      { name: "Tailwind CSS & Animations", level: 95 },
    ]
  },
  {
    title: "Backend & Systems",
    skills: [
      { name: "Node.js / Express", level: 85 },
      { name: "Python / Scripting", level: 82 },
      { name: "REST APIs & WebSockets", level: 88 },
      { name: "SQL & NoSQL Databases", level: 80 },
    ]
  },
  {
    title: "Computer Science & Tools",
    skills: [
      { name: "Data Structures & Algorithms", level: 90 },
      { name: "Git & Version Control", level: 92 },
      { name: "System Architecture & Design", level: 80 },
      { name: "Performance Optimization", level: 86 },
    ]
  }
];

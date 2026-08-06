export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: "Web & Interactive" | "AI & Tools" | "Full Stack";
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    iconName?: string;
  }[];
}

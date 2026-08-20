export interface Project {
  id: string;
  title: string;
  role?: string;
  description: string;
  longDescription?: string;
  category: "Web & Interactive" | "AI & Tools" | "Full Stack" | "Hackathon Projects" | "Other";
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
  hackathonName?: string;
  hackathonId?: string;
  isOther?: boolean;
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

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  venue?: string;
  date: string;
  duration?: string;
  teamName?: string;
  type: "Offline Hackathon" | "Online Hackathon" | "CTF Hackathon" | "National Competition";
  result: string;
  isWinner?: boolean;
  awardRank?: "1st" | "Winner" | "Participant";
  description: string;
  projectOrFocus?: string;
  projectId?: string;
  projectName?: string;
  projectRole?: string;
  certificateUrl?: string;
  tags: string[];
}

export interface EducationItem {
  qualification: string;
  fieldStream: string;
  institution: string;
  duration: string;
  gpa: string;
}


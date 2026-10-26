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
  imageUrl?: string;
  screenshots?: string[];
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
  /** ISO start date (YYYY-MM-DD), used for ordering and the page date plate */
  startDate: string;
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
  /** Image of the certificate, shown on the book page and in the details view */
  certificateImage?: string;
  /** What the certificate itself says, when it differs from the result (e.g. a participation certificate for a winning entry) */
  certificateKind?: "participation" | "award";
  tags: string[];
  /** Photo shown on this competition's page in the flipbook */
  coverImage?: string;
  images?: string[];
}

export interface EducationItem {
  qualification: string;
  fieldStream: string;
  institution: string;
  duration: string;
}


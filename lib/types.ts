export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  marketDemand: number;
  trendDirection: "up" | "down" | "stable";
  description?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: "course" | "book" | "video" | "project" | "certification";
  provider: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  rating: number;
  url: string;
  cost: "free" | "paid";
}

export interface LearningPath {
  id: string;
  skillId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  resources: LearningResource[];
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetLevel: number;
  estimatedWeeks: number;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  experience: number;
  careerGoals: string[];
  skills: Skill[];
  completedAssessments: Assessment[];
}

export interface Assessment {
  id: string;
  skillId: string;
  score: number;
  completedAt: Date;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "practical" | "scenario";
  options?: string[];
  correctAnswer?: string;
  userAnswer?: string;
  difficulty: number;
}

export interface MarketInsight {
  skillId: string;
  demandScore: number;
  salaryImpact: number;
  jobOpenings: number;
  trendData: TrendPoint[];
  relatedSkills: string[];
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface SkillGapAnalysis {
  totalSkills: number;
  skillsWithGaps: number;
  averageGap: number;
  criticalGaps: Skill[];
  improvementPotential: number;
}

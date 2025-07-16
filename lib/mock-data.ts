import {
  Skill,
  LearningPath,
  LearningResource,
  UserProfile,
  MarketInsight,
  SkillGapAnalysis,
} from "./types";

export const mockSkills: Skill[] = [
  {
    id: "1",
    name: "React",
    category: "Frontend",
    currentLevel: 75,
    targetLevel: 90,
    marketDemand: 95,
    trendDirection: "up",
    description: "Modern JavaScript library for building user interfaces",
  },
  {
    id: "2",
    name: "TypeScript",
    category: "Programming Languages",
    currentLevel: 60,
    targetLevel: 85,
    marketDemand: 88,
    trendDirection: "up",
    description: "Typed superset of JavaScript",
  },
  {
    id: "3",
    name: "Node.js",
    category: "Backend",
    currentLevel: 45,
    targetLevel: 80,
    marketDemand: 82,
    trendDirection: "stable",
    description: "JavaScript runtime for server-side development",
  },
  {
    id: "4",
    name: "Python",
    category: "Programming Languages",
    currentLevel: 70,
    targetLevel: 85,
    marketDemand: 90,
    trendDirection: "up",
    description: "Versatile programming language for web, data science, and AI",
  },
  {
    id: "5",
    name: "Machine Learning",
    category: "AI/ML",
    currentLevel: 30,
    targetLevel: 75,
    marketDemand: 92,
    trendDirection: "up",
    description: "Algorithms and statistical models for data analysis",
  },
  {
    id: "6",
    name: "AWS",
    category: "Cloud",
    currentLevel: 40,
    targetLevel: 70,
    marketDemand: 85,
    trendDirection: "up",
    description: "Amazon Web Services cloud platform",
  },
];

export const mockLearningResources: LearningResource[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    type: "course",
    provider: "Frontend Masters",
    duration: "6 hours",
    difficulty: "advanced",
    rating: 4.8,
    url: "#",
    cost: "paid",
  },
  {
    id: "2",
    title: "TypeScript Deep Dive",
    type: "book",
    provider: "Basarat Ali Syed",
    duration: "2 weeks",
    difficulty: "intermediate",
    rating: 4.7,
    url: "#",
    cost: "free",
  },
  {
    id: "3",
    title: "Build a Full-Stack App",
    type: "project",
    provider: "Self-guided",
    duration: "4 weeks",
    difficulty: "intermediate",
    rating: 4.5,
    url: "#",
    cost: "free",
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: "1",
    skillId: "1",
    title: "React Mastery Path",
    description:
      "Become an expert React developer with advanced patterns and best practices",
    estimatedDuration: "8 weeks",
    difficulty: "advanced",
    resources: mockLearningResources,
    milestones: [
      {
        id: "1",
        title: "Master Hooks",
        description: "Deep understanding of React Hooks and custom hooks",
        targetLevel: 80,
        estimatedWeeks: 2,
        completed: false,
      },
      {
        id: "2",
        title: "Performance Optimization",
        description: "Learn React performance optimization techniques",
        targetLevel: 85,
        estimatedWeeks: 3,
        completed: false,
      },
      {
        id: "3",
        title: "Advanced Patterns",
        description: "Implement compound components, render props, and HOCs",
        targetLevel: 90,
        estimatedWeeks: 3,
        completed: false,
      },
    ],
  },
];

export const mockUserProfile: UserProfile = {
  id: "1",
  name: "Alex Johnson",
  role: "Full Stack Developer",
  experience: 3,
  careerGoals: ["Senior Developer", "Tech Lead", "Solution Architect"],
  skills: mockSkills,
  completedAssessments: [],
};

export const mockMarketInsights: MarketInsight[] = [
  {
    skillId: "1",
    demandScore: 95,
    salaryImpact: 15,
    jobOpenings: 12500,
    trendData: [
      { date: "2024-01", value: 85 },
      { date: "2024-02", value: 88 },
      { date: "2024-03", value: 92 },
      { date: "2024-04", value: 95 },
    ],
    relatedSkills: ["JavaScript", "Redux", "Next.js"],
  },
];

export const mockSkillGapAnalysis: SkillGapAnalysis = {
  totalSkills: 6,
  skillsWithGaps: 5,
  averageGap: 22,
  criticalGaps: mockSkills.filter(
    (skill) => skill.targetLevel - skill.currentLevel > 30
  ),
  improvementPotential: 78,
};

export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  marketDemand: number;
  trendDirection: 'up' | 'down' | 'stable';
  description?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'video' | 'project' | 'certification';
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  url: string;
  cost: 'free' | 'paid';
}

export interface LearningPath {
  id: string;
  skillId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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
  type: 'multiple-choice' | 'practical' | 'scenario';
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

// AI Analytics Types

export interface AIAnalysisResult {
  strengths: SkillStrength[];
  weaknesses: SkillGap[];
  marketInsights: MarketData;
  careerRecommendations: string[];
  confidenceLevel: number;
  analysisDate: Date;
  dataSourcesUsed: string[];
}

export interface UserSkillData {
  manualSkills: UserSkill[];
  githubAnalysis?: RepositoryAnalysis;
  learningPlatformData: LearningPlatformData[];
  careerGoals: CareerGoals;
  assessmentHistory: Assessment[];
}

export interface SkillStrength {
  skillName: string;
  proficiencyLevel: number;
  percentileRank: number;
  trendDirection: 'up' | 'down' | 'stable';
  confidenceScore: number;
  evidenceSources: string[];
  marketValue: number;
}

export interface SkillGap {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  impactOnCareer: string;
  industryBenchmark: number;
  recommendedActions: string[];
  estimatedTimeToClose: string;
}

export interface PersonalizedPlan {
  id: string;
  generatedDate: Date;
  recommendations: Recommendation[];
  estimatedTimeframe: string;
  priorityLevel: 'high' | 'medium' | 'low';
  customizations: PlanCustomization[];
  targetSkills: string[];
  successMetrics: SuccessMetric[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionType: 'course' | 'practice' | 'project' | 'certification';
  resources: LearningResource[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetSkills: string[];
  priority: number;
  cost: 'free' | 'paid' | 'mixed';
}

export interface PlanCustomization {
  id: string;
  type: 'timeline' | 'focus_area' | 'learning_style' | 'budget';
  value: string;
  appliedDate: Date;
}

export interface SuccessMetric {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
}

// GitHub Integration Types

export interface GitHubProfile {
  username: string;
  publicRepos: number;
  followers: number;
  following: number;
  accountCreated: Date;
  lastActivity: Date;
  primaryLanguages: string[];
  contributionStats: ContributionStats;
}

export interface RepositoryAnalysis {
  totalRepositories: number;
  languages: LanguageUsage[];
  frameworks: FrameworkUsage[];
  complexityMetrics: CodeComplexity;
  contributionPatterns: ContributionData;
  skillConfidence: SkillConfidenceMap;
  projectTypes: ProjectType[];
  collaborationScore: number;
}

export interface LanguageUsage {
  language: string;
  linesOfCode: number;
  fileCount: number;
  complexityScore: number;
  recentActivity: boolean;
  proficiencyIndicator: number;
  repositoryCount: number;
}

export interface FrameworkUsage {
  framework: string;
  category: string;
  usageFrequency: number;
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
  lastUsed: Date;
  projectCount: number;
}

export interface CodeComplexity {
  averageCyclomaticComplexity: number;
  codeQualityScore: number;
  testCoverage: number;
  documentationScore: number;
  maintainabilityIndex: number;
}

export interface ContributionData {
  totalCommits: number;
  averageCommitsPerMonth: number;
  consistencyScore: number;
  peakActivityPeriods: string[];
  collaborativeProjects: number;
}

export interface ContributionStats {
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
  contributionsLastYear: number;
}

export interface SkillConfidenceMap {
  [skillName: string]: {
    confidence: number;
    evidence: string[];
    lastUpdated: Date;
  };
}

export interface ProjectType {
  type: string;
  count: number;
  complexity: 'simple' | 'moderate' | 'complex';
  technologies: string[];
}

// Learning Platform Integration Types

export interface LearningPlatformData {
  platformName: string;
  platformId: string;
  userId: string;
  completedCourses: CourseData[];
  inProgressCourses: CourseData[];
  certifications: Certification[];
  totalLearningHours: number;
  skillsAcquired: string[];
  lastSyncDate: Date;
}

export interface CourseData {
  id: string;
  title: string;
  provider: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  completionDate?: Date;
  progressPercentage: number;
  rating?: number;
  skills: string[];
  certificateUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateEarned: Date;
  expirationDate?: Date;
  verificationUrl: string;
  relatedSkills: string[];
  credibilityScore: number;
}

// Skill Assessment and Validation Types

export interface UserSkill {
  id: string;
  name: string;
  category: SkillCategory;
  selfAssessedLevel: number;
  validatedLevel?: number;
  confidenceScore: number;
  source: 'manual' | 'github' | 'platform' | 'assessment';
  lastUpdated: Date;
  validationHistory: ValidationRecord[];
}

export interface SkillCategory {
  id: string;
  name: string;
  parentCategory?: string;
  description: string;
  marketDemand: number;
}

export interface ValidationRecord {
  date: Date;
  method: 'challenge' | 'peer_review' | 'certification' | 'project';
  score: number;
  feedback?: string;
}

export interface CodingChallenge {
  id: string;
  skillId: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prompt: string;
  expectedOutput: string;
  timeLimit: number;
  language: string;
  testCases: TestCase[];
  hints: string[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

// Career and Market Data Types

export interface CareerGoals {
  targetRole: string;
  targetIndustry: string;
  timeframe: string;
  salaryExpectation?: number;
  preferredCompanySize: 'startup' | 'medium' | 'enterprise' | 'any';
  workStyle: 'remote' | 'hybrid' | 'onsite' | 'any';
  prioritySkills: string[];
}

export interface MarketData {
  industryTrends: IndustryTrend[];
  salaryBenchmarks: SalaryBenchmark[];
  skillDemand: SkillDemandData[];
  jobMarketHealth: JobMarketHealth;
  emergingSkills: EmergingSkill[];
}

export interface IndustryTrend {
  industry: string;
  growthRate: number;
  outlook: 'positive' | 'neutral' | 'negative';
  keyDrivers: string[];
  timeframe: string;
}

export interface SalaryBenchmark {
  role: string;
  industry: string;
  experience: string;
  location: string;
  salary: {
    min: number;
    max: number;
    median: number;
    currency: string;
  };
  lastUpdated: Date;
}

export interface SkillDemandData {
  skillName: string;
  demandScore: number;
  growthRate: number;
  jobPostings: number;
  averageSalaryImpact: number;
  relatedRoles: string[];
}

export interface JobMarketHealth {
  overallScore: number;
  hiringTrends: 'increasing' | 'stable' | 'decreasing';
  competitionLevel: 'low' | 'medium' | 'high';
  averageTimeToHire: number;
  topInDemandSkills: string[];
}

export interface EmergingSkill {
  name: string;
  category: string;
  emergenceScore: number;
  projectedDemand: number;
  relatedTechnologies: string[];
  learningResources: LearningResource[];
}

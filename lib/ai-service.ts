import {
  AIAnalysisResult,
  UserSkillData,
  PersonalizedPlan,
  CareerGoals,
  SkillStrength,
  SkillGap,
  MarketData,
} from './types';

// Configuration interfaces
export interface AIServiceConfig {
  apiEndpoint: string;
  apiKey: string;
  rateLimitPerHour: number;
  timeoutSeconds: number;
  retryAttempts: number;
  dataPrivacyLevel: 'basic' | 'enhanced' | 'maximum';
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface RateLimitState {
  requestCount: number;
  windowStart: number;
  windowDuration: number;
  maxRequests: number;
}

// Error types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class RateLimitError extends AIServiceError {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, true);
  }
}

export class AuthenticationError extends AIServiceError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_FAILED', 401, false);
  }
}

export class ValidationError extends AIServiceError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400, false);
  }
}

// Data anonymization utilities
class DataAnonymizer {
  private static readonly SENSITIVE_FIELDS = [
    'email',
    'phone',
    'address',
    'ssn',
    'personalId',
    'fullName',
  ];

  static anonymizeUserData(
    data: UserSkillData,
    privacyLevel: string
  ): UserSkillData {
    const anonymized = JSON.parse(JSON.stringify(data));

    switch (privacyLevel) {
      case 'maximum':
        return this.maximumAnonymization(anonymized);
      case 'enhanced':
        return this.enhancedAnonymization(anonymized);
      case 'basic':
      default:
        return this.basicAnonymization(anonymized);
    }
  }

  private static basicAnonymization(data: UserSkillData): UserSkillData {
    // Remove direct identifiers
    if (data.githubAnalysis) {
      delete (data.githubAnalysis as any).username;
      delete (data.githubAnalysis as any).email;
    }

    // Hash learning platform user IDs
    data.learningPlatformData.forEach(platform => {
      platform.userId = this.hashString(platform.userId);
    });

    return data;
  }

  private static enhancedAnonymization(data: UserSkillData): UserSkillData {
    const basicAnonymized = this.basicAnonymization(data);

    // Remove timestamps that could be identifying
    basicAnonymized.manualSkills.forEach(skill => {
      skill.lastUpdated = new Date(0);
      skill.validationHistory = [];
    });

    // Generalize career goals
    if (basicAnonymized.careerGoals.targetRole) {
      basicAnonymized.careerGoals.targetRole = this.generalizeRole(
        basicAnonymized.careerGoals.targetRole
      );
    }

    return basicAnonymized;
  }

  private static maximumAnonymization(data: UserSkillData): UserSkillData {
    const enhancedAnonymized = this.enhancedAnonymization(data);

    // Remove all platform-specific data
    enhancedAnonymized.learningPlatformData = [];

    // Remove GitHub analysis entirely
    delete enhancedAnonymized.githubAnalysis;

    // Keep only skill categories and levels, remove names
    enhancedAnonymized.manualSkills.forEach(skill => {
      skill.name = `skill_${skill.category.name}_${skill.selfAssessedLevel}`;
      skill.id = this.hashString(skill.id);
    });

    return enhancedAnonymized;
  }

  private static hashString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private static generalizeRole(role: string): string {
    const roleMap: { [key: string]: string } = {
      'senior software engineer': 'software_engineer',
      'software engineer': 'software_engineer',
      'frontend developer': 'frontend_developer',
      'backend developer': 'backend_developer',
      'full stack developer': 'fullstack_developer',
      'data scientist': 'data_scientist',
      'product manager': 'product_manager',
      'devops engineer': 'devops_engineer',
    };

    return roleMap[role.toLowerCase()] || 'other_technical_role';
  }
}

// Main AI Integration Service
export class AIIntegrationService {
  private config: AIServiceConfig;
  private rateLimitState: RateLimitState;
  private retryConfig: RetryConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.rateLimitState = {
      requestCount: 0,
      windowStart: Date.now(),
      windowDuration: 3600000, // 1 hour in milliseconds
      maxRequests: config.rateLimitPerHour,
    };
    this.retryConfig = {
      maxAttempts: config.retryAttempts,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffMultiplier: 2,
    };
  }

  /**
   * Validates the API connection and credentials
   */
  async validateConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/health', 'GET');
      return response.status === 'ok';
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      return false;
    }
  }

  /**
   * Analyzes user skills and generates comprehensive insights
   */
  async analyzeSkills(userData: UserSkillData): Promise<AIAnalysisResult> {
    this.validateUserData(userData);

    const anonymizedData = DataAnonymizer.anonymizeUserData(
      userData,
      this.config.dataPrivacyLevel
    );

    const response = await this.makeRequest('/analyze/skills', 'POST', {
      userData: anonymizedData,
      analysisOptions: {
        includeMarketInsights: true,
        includeCareerRecommendations: true,
        confidenceThreshold: 0.7,
      },
    });

    return this.parseAnalysisResult(response);
  }

  /**
   * Generates personalized improvement plan based on analysis
   */
  async generateImprovementPlan(
    analysis: AIAnalysisResult,
    goals: CareerGoals
  ): Promise<PersonalizedPlan> {
    const response = await this.makeRequest('/generate/plan', 'POST', {
      analysis: {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        marketInsights: analysis.marketInsights,
      },
      careerGoals: goals,
      planOptions: {
        timeframe: goals.timeframe,
        focusAreas: goals.prioritySkills,
        learningStyle: 'mixed', // Could be made configurable
      },
    });

    return this.parseImprovementPlan(response);
  }

  /**
   * Tracks progress and provides insights on skill development
   */
  async trackProgress(
    currentData: UserSkillData,
    historicalData: AIAnalysisResult[]
  ): Promise<{
    progressInsights: string[];
    trendAnalysis: SkillStrength[];
    nextMilestones: string[];
  }> {
    const anonymizedCurrent = DataAnonymizer.anonymizeUserData(
      currentData,
      this.config.dataPrivacyLevel
    );

    const response = await this.makeRequest('/track/progress', 'POST', {
      currentData: anonymizedCurrent,
      historicalAnalyses: historicalData.map(analysis => ({
        date: analysis.analysisDate,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        confidenceLevel: analysis.confidenceLevel,
      })),
    });

    return response;
  }

  /**
   * Makes HTTP requests with retry logic and rate limiting
   */
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<any> {
    await this.checkRateLimit();

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        const response = await this.executeRequest(endpoint, method, data);
        this.updateRateLimit();
        return response;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof AIServiceError && !error.retryable) {
          throw error;
        }

        if (error instanceof RateLimitError) {
          await this.handleRateLimit(error.retryAfter);
          continue;
        }

        if (attempt === this.retryConfig.maxAttempts) {
          break;
        }

        const delay = this.calculateRetryDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw new AIServiceError(
      `Request failed after ${this.retryConfig.maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`,
      'MAX_RETRIES_EXCEEDED',
      undefined,
      false
    );
  }

  /**
   * Executes the actual HTTP request
   */
  private async executeRequest(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<any> {
    const url = `${this.config.apiEndpoint}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeoutSeconds * 1000
    );

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          'User-Agent': 'SkillGapAnalyzer/1.0',
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof AIServiceError) {
        throw error;
      }

      if ((error as Error).name === 'AbortError') {
        throw new AIServiceError('Request timeout', 'TIMEOUT', 408, true);
      }

      throw new AIServiceError(
        `Network error: ${(error as Error).message}`,
        'NETWORK_ERROR',
        undefined,
        true
      );
    }
  }

  /**
   * Handles HTTP error responses
   */
  private async handleHttpError(response: Response): Promise<never> {
    const errorBody = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorJson = JSON.parse(errorBody);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      // Use default error message if JSON parsing fails
    }

    switch (response.status) {
      case 401:
        throw new AuthenticationError(errorMessage);
      case 429:
        const retryAfter = parseInt(
          response.headers.get('Retry-After') || '60'
        );
        throw new RateLimitError(errorMessage, retryAfter);
      case 400:
        throw new ValidationError(errorMessage);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new AIServiceError(
          errorMessage,
          'SERVER_ERROR',
          response.status,
          true
        );
      default:
        throw new AIServiceError(
          errorMessage,
          'HTTP_ERROR',
          response.status,
          false
        );
    }
  }

  /**
   * Rate limiting management
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();

    // Reset window if expired
    if (
      now - this.rateLimitState.windowStart >=
      this.rateLimitState.windowDuration
    ) {
      this.rateLimitState.requestCount = 0;
      this.rateLimitState.windowStart = now;
    }

    // Check if rate limit exceeded
    if (this.rateLimitState.requestCount >= this.rateLimitState.maxRequests) {
      const waitTime =
        this.rateLimitState.windowDuration -
        (now - this.rateLimitState.windowStart);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${Math.ceil(
          waitTime / 1000
        )} seconds.`,
        Math.ceil(waitTime / 1000)
      );
    }
  }

  private updateRateLimit(): void {
    this.rateLimitState.requestCount++;
  }

  private async handleRateLimit(retryAfter: number): Promise<void> {
    await this.sleep(retryAfter * 1000);
  }

  /**
   * Retry delay calculation with exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const delay =
      this.retryConfig.baseDelay *
      Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Data validation
   */
  private validateUserData(userData: UserSkillData): void {
    if (!userData) {
      throw new ValidationError('User data is required');
    }

    if (!userData.manualSkills || userData.manualSkills.length === 0) {
      throw new ValidationError('At least one skill is required');
    }

    if (!userData.careerGoals) {
      throw new ValidationError('Career goals are required');
    }

    // Validate skill levels
    userData.manualSkills.forEach(skill => {
      if (skill.selfAssessedLevel < 0 || skill.selfAssessedLevel > 100) {
        throw new ValidationError(
          `Invalid skill level for ${skill.name}: must be between 0 and 100`
        );
      }
    });
  }

  /**
   * Response parsing utilities
   */
  private parseAnalysisResult(response: any): AIAnalysisResult {
    return {
      strengths: response.strengths || [],
      weaknesses: response.weaknesses || [],
      marketInsights: response.marketInsights || {},
      careerRecommendations: response.careerRecommendations || [],
      confidenceLevel: response.confidenceLevel || 0,
      analysisDate: new Date(),
      dataSourcesUsed: response.dataSourcesUsed || ['manual_input'],
    };
  }

  private parseImprovementPlan(response: any): PersonalizedPlan {
    return {
      id: response.id || `plan_${Date.now()}`,
      generatedDate: new Date(),
      recommendations: response.recommendations || [],
      estimatedTimeframe: response.estimatedTimeframe || '6 months',
      priorityLevel: response.priorityLevel || 'medium',
      customizations: [],
      targetSkills: response.targetSkills || [],
      successMetrics: response.successMetrics || [],
    };
  }

  /**
   * Configuration management
   */
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update rate limit if changed
    if (newConfig.rateLimitPerHour) {
      this.rateLimitState.maxRequests = newConfig.rateLimitPerHour;
    }
  }

  getConfig(): AIServiceConfig {
    // Return a copy to prevent external modification
    return { ...this.config };
  }

  /**
   * Health check and monitoring
   */
  async getServiceHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    rateLimitStatus: {
      remaining: number;
      resetTime: number;
    };
  }> {
    const startTime = Date.now();

    try {
      await this.validateConnection();
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime < 2000 ? 'healthy' : 'degraded',
        responseTime,
        rateLimitStatus: {
          remaining:
            this.rateLimitState.maxRequests - this.rateLimitState.requestCount,
          resetTime:
            this.rateLimitState.windowStart +
            this.rateLimitState.windowDuration,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        rateLimitStatus: {
          remaining:
            this.rateLimitState.maxRequests - this.rateLimitState.requestCount,
          resetTime:
            this.rateLimitState.windowStart +
            this.rateLimitState.windowDuration,
        },
      };
    }
  }
}

// Factory function for creating service instances
export function createAIService(config: AIServiceConfig): AIIntegrationService {
  return new AIIntegrationService(config);
}

// Default configuration
export const DEFAULT_AI_CONFIG: Partial<AIServiceConfig> = {
  rateLimitPerHour: 100,
  timeoutSeconds: 30,
  retryAttempts: 3,
  dataPrivacyLevel: 'enhanced',
};

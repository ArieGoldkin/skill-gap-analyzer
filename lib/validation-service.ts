import {
  CodingChallenge,
  TestCase,
  UserSkill,
  SkillCategory,
  ValidationRecord,
} from './types';

export interface ChallengeResult {
  challengeId: string;
  skillId: string;
  score: number;
  completionTime: number;
  passedTests: number;
  totalTests: number;
  feedback: string;
  confidenceAdjustment: number;
}

export interface ValidationResult {
  originalLevel: number;
  adjustedLevel: number;
  confidenceScore: number;
  validationRecord: ValidationRecord;
  recommendations: string[];
}

/**
 * Service for managing coding challenges and skill validation
 */
export class CodingChallengeService {
  private challenges: Map<string, CodingChallenge[]> = new Map();
  private challengeTemplates: ChallengeTemplate[] = [];

  constructor() {
    this.initializeChallengeTemplates();
  }

  /**
   * Generate a coding challenge based on skill category and difficulty
   */
  generateChallenge(
    skillId: string,
    skillName: string,
    category: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    language: string = 'javascript'
  ): CodingChallenge {
    const template = this.findBestTemplate(category, difficulty, language);

    if (!template) {
      throw new Error(
        `No challenge template found for ${category} at ${difficulty} level`
      );
    }

    const challenge: CodingChallenge = {
      id: this.generateChallengeId(),
      skillId,
      title: template.title.replace('{skill}', skillName),
      difficulty,
      prompt: template.prompt,
      expectedOutput: template.expectedOutput,
      timeLimit: template.timeLimit,
      language,
      testCases: template.testCases,
      hints: template.hints,
    };

    // Store challenge for later validation
    if (!this.challenges.has(skillId)) {
      this.challenges.set(skillId, []);
    }
    this.challenges.get(skillId)!.push(challenge);

    return challenge;
  }

  /**
   * Validate a coding challenge submission
   */
  async validateChallenge(
    challengeId: string,
    userCode: string,
    completionTime: number
  ): Promise<ChallengeResult> {
    const challenge = this.findChallengeById(challengeId);
    if (!challenge) {
      throw new Error(`Challenge ${challengeId} not found`);
    }

    const testResults = await this.runTestCases(
      userCode,
      challenge.testCases,
      challenge.language
    );
    const score = this.calculateScore(
      testResults,
      completionTime,
      challenge.timeLimit
    );
    const feedback = this.generateFeedback(
      testResults,
      score,
      challenge.difficulty
    );
    const confidenceAdjustment = this.calculateConfidenceAdjustment(
      score,
      challenge.difficulty
    );

    return {
      challengeId,
      skillId: challenge.skillId,
      score,
      completionTime,
      passedTests: testResults.passed,
      totalTests: testResults.total,
      feedback,
      confidenceAdjustment,
    };
  }

  /**
   * Process validation result and adjust skill level
   */
  processValidationResult(
    userSkill: UserSkill,
    challengeResult: ChallengeResult
  ): ValidationResult {
    const originalLevel = userSkill.selfAssessedLevel;
    const adjustedLevel = this.calculateAdjustedLevel(
      originalLevel,
      challengeResult
    );
    const confidenceScore = this.calculateUpdatedConfidence(
      userSkill.confidenceScore,
      challengeResult
    );

    const validationRecord: ValidationRecord = {
      date: new Date(),
      method: 'challenge',
      score: challengeResult.score,
      feedback: challengeResult.feedback,
    };

    const recommendations = this.generateRecommendations(
      challengeResult,
      adjustedLevel,
      originalLevel
    );

    return {
      originalLevel,
      adjustedLevel,
      confidenceScore,
      validationRecord,
      recommendations,
    };
  }

  /**
   * Get available challenges for a skill
   */
  getAvailableChallenges(skillId: string): CodingChallenge[] {
    return this.challenges.get(skillId) || [];
  }

  /**
   * Calculate confidence score based on multiple validation attempts
   */
  calculateSkillConfidence(validationHistory: ValidationRecord[]): number {
    if (validationHistory.length === 0) return 0.3; // Low confidence for unvalidated skills

    const recentValidations = validationHistory
      .filter(record => {
        const daysSince =
          (Date.now() - record.date.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 90; // Consider validations from last 90 days
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (recentValidations.length === 0) return 0.4; // Slightly higher for old validations

    // Weight recent validations more heavily
    let weightedScore = 0;
    let totalWeight = 0;

    recentValidations.forEach((record, index) => {
      const weight = Math.pow(0.8, index); // Exponential decay for older validations
      weightedScore += record.score * weight;
      totalWeight += weight;
    });

    const averageScore = weightedScore / totalWeight;

    // Convert score to confidence (0-1 range)
    const baseConfidence = Math.min(averageScore / 100, 1);

    // Boost confidence based on number of validations
    const validationBoost = Math.min(recentValidations.length * 0.1, 0.3);

    return Math.min(baseConfidence + validationBoost, 1);
  }

  private initializeChallengeTemplates(): void {
    this.challengeTemplates = [
      // JavaScript/Programming Logic challenges
      {
        category: 'programming',
        difficulty: 'beginner',
        language: 'javascript',
        title: 'Basic {skill} Challenge',
        prompt:
          'Write a function that takes an array of numbers and returns the sum of all even numbers.',
        expectedOutput: 'Function should return correct sum of even numbers',
        timeLimit: 15,
        testCases: [
          {
            input: '[1, 2, 3, 4, 5, 6]',
            expectedOutput: '12',
            isHidden: false,
            weight: 1,
          },
          {
            input: '[2, 4, 6, 8]',
            expectedOutput: '20',
            isHidden: false,
            weight: 1,
          },
          {
            input: '[1, 3, 5]',
            expectedOutput: '0',
            isHidden: true,
            weight: 1,
          },
          { input: '[]', expectedOutput: '0', isHidden: true, weight: 1 },
        ],
        hints: [
          'Consider using filter() and reduce()',
          'Remember to check if number % 2 === 0',
        ],
      },
      {
        category: 'programming',
        difficulty: 'intermediate',
        language: 'javascript',
        title: 'Intermediate {skill} Challenge',
        prompt:
          'Implement a function that finds the longest common subsequence between two strings.',
        expectedOutput:
          'Function should return the length of the longest common subsequence',
        timeLimit: 30,
        testCases: [
          {
            input: '"ABCDGH", "AEDFHR"',
            expectedOutput: '3',
            isHidden: false,
            weight: 1,
          },
          {
            input: '"AGGTAB", "GXTXAYB"',
            expectedOutput: '4',
            isHidden: false,
            weight: 1,
          },
          {
            input: '"", "ABC"',
            expectedOutput: '0',
            isHidden: true,
            weight: 1,
          },
          {
            input: '"ABC", "ABC"',
            expectedOutput: '3',
            isHidden: true,
            weight: 1,
          },
        ],
        hints: [
          'This is a dynamic programming problem',
          'Consider using a 2D array to store intermediate results',
        ],
      },
      {
        category: 'programming',
        difficulty: 'advanced',
        language: 'javascript',
        title: 'Advanced {skill} Challenge',
        prompt:
          'Implement a function that solves the N-Queens problem and returns all possible solutions.',
        expectedOutput:
          'Function should return array of all valid N-Queens solutions',
        timeLimit: 45,
        testCases: [
          { input: '4', expectedOutput: '2', isHidden: false, weight: 1 },
          { input: '1', expectedOutput: '1', isHidden: false, weight: 1 },
          { input: '8', expectedOutput: '92', isHidden: true, weight: 2 },
        ],
        hints: [
          'Use backtracking algorithm',
          'Check for conflicts in rows, columns, and diagonals',
        ],
      },
      // React/Frontend challenges
      {
        category: 'frontend',
        difficulty: 'beginner',
        language: 'javascript',
        title: 'Basic React {skill} Challenge',
        prompt:
          'Create a React component that displays a counter with increment and decrement buttons.',
        expectedOutput:
          'Component should manage state and update counter correctly',
        timeLimit: 20,
        testCases: [
          {
            input: 'Initial render',
            expectedOutput: 'Counter shows 0',
            isHidden: false,
            weight: 1,
          },
          {
            input: 'Click increment',
            expectedOutput: 'Counter shows 1',
            isHidden: false,
            weight: 1,
          },
          {
            input: 'Click decrement',
            expectedOutput: 'Counter shows -1',
            isHidden: true,
            weight: 1,
          },
        ],
        hints: ['Use useState hook', 'Handle button click events'],
      },
      // Data Structures challenges
      {
        category: 'data-structures',
        difficulty: 'intermediate',
        language: 'javascript',
        title: '{skill} Implementation Challenge',
        prompt:
          'Implement a binary search tree with insert, search, and delete operations.',
        expectedOutput:
          'BST should maintain proper ordering and support all operations',
        timeLimit: 40,
        testCases: [
          {
            input: 'Insert 5, 3, 7, 1, 9',
            expectedOutput: 'Tree structure correct',
            isHidden: false,
            weight: 1,
          },
          {
            input: 'Search for 7',
            expectedOutput: 'Returns true',
            isHidden: false,
            weight: 1,
          },
          {
            input: 'Delete 3',
            expectedOutput: 'Tree maintains BST property',
            isHidden: true,
            weight: 2,
          },
        ],
        hints: [
          'Remember BST property: left < root < right',
          'Handle deletion cases carefully',
        ],
      },
    ];
  }

  private findBestTemplate(
    category: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    language: string
  ): ChallengeTemplate | null {
    // First try exact match
    let template = this.challengeTemplates.find(
      t =>
        t.category === category &&
        t.difficulty === difficulty &&
        t.language === language
    );

    if (template) return template;

    // Fallback to category and difficulty match with any language
    template = this.challengeTemplates.find(
      t => t.category === category && t.difficulty === difficulty
    );

    if (template) return template;

    // Fallback to programming category with matching difficulty
    template = this.challengeTemplates.find(
      t => t.category === 'programming' && t.difficulty === difficulty
    );

    return template || null;
  }

  private findChallengeById(challengeId: string): CodingChallenge | null {
    const skillIds = Array.from(this.challenges.keys());
    for (const skillId of skillIds) {
      const challenges = this.challenges.get(skillId);
      if (challenges) {
        const challenge = challenges.find(
          (c: CodingChallenge) => c.id === challengeId
        );
        if (challenge) return challenge;
      }
    }
    return null;
  }

  private async runTestCases(
    userCode: string,
    testCases: TestCase[],
    language: string
  ): Promise<{ passed: number; total: number; details: TestResult[] }> {
    // In a real implementation, this would execute code in a sandboxed environment
    // For now, we'll simulate test execution
    const results: TestResult[] = [];
    let passed = 0;

    for (const testCase of testCases) {
      try {
        // Simulate code execution - in reality, this would use a code execution service
        const result = this.simulateCodeExecution(
          userCode,
          testCase.input,
          language
        );
        const success = result === testCase.expectedOutput;

        if (success) passed++;

        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
          passed: success,
          weight: testCase.weight,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: `Error: ${error}`,
          passed: false,
          weight: testCase.weight,
        });
      }
    }

    return { passed, total: testCases.length, details: results };
  }

  private simulateCodeExecution(
    code: string,
    input: string,
    language: string
  ): string {
    // This is a simulation - in a real implementation, you'd use a secure code execution service
    // For demonstration, we'll return success for basic patterns
    if (
      code.includes('filter') &&
      code.includes('reduce') &&
      input.includes('[')
    ) {
      // Simulate array sum calculation
      try {
        const arr = JSON.parse(input.split(',')[0]);
        const sum = arr
          .filter((n: number) => n % 2 === 0)
          .reduce((a: number, b: number) => a + b, 0);
        return sum.toString();
      } catch {
        return '0';
      }
    }

    // Default simulation response
    return 'simulated_output';
  }

  private calculateScore(
    testResults: { passed: number; total: number; details: TestResult[] },
    completionTime: number,
    timeLimit: number
  ): number {
    const { passed, total, details } = testResults;

    // Base score from test results (weighted)
    const totalWeight = details.reduce((sum, result) => sum + result.weight, 0);
    const weightedPassed = details
      .filter(result => result.passed)
      .reduce((sum, result) => sum + result.weight, 0);

    const testScore = (weightedPassed / totalWeight) * 70; // 70% from tests

    // Time bonus (30% max)
    const timeRatio = Math.min(completionTime / (timeLimit * 60), 1); // Convert minutes to seconds
    const timeBonus = Math.max(0, (1 - timeRatio) * 30);

    return Math.min(testScore + timeBonus, 100);
  }

  private generateFeedback(
    testResults: { passed: number; total: number; details: TestResult[] },
    score: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): string {
    const { passed, total } = testResults;
    const passRate = (passed / total) * 100;

    let feedback = `You passed ${passed} out of ${total} test cases (${passRate.toFixed(1)}%). `;

    if (score >= 90) {
      feedback +=
        'Excellent work! Your solution demonstrates strong understanding of the concept.';
    } else if (score >= 70) {
      feedback +=
        'Good job! Your solution works well with room for minor improvements.';
    } else if (score >= 50) {
      feedback +=
        'Your solution shows basic understanding but needs improvement in edge cases or efficiency.';
    } else {
      feedback +=
        'Your solution needs significant improvement. Consider reviewing the fundamentals.';
    }

    // Add difficulty-specific feedback
    if (difficulty === 'advanced' && score >= 60) {
      feedback +=
        ' Tackling advanced challenges shows strong problem-solving skills.';
    } else if (difficulty === 'beginner' && score < 70) {
      feedback +=
        ' Focus on understanding the basic concepts before moving to more complex problems.';
    }

    return feedback;
  }

  private calculateConfidenceAdjustment(
    score: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): number {
    const difficultyMultiplier = {
      beginner: 0.5,
      intermediate: 1.0,
      advanced: 1.5,
    };

    // Score above 80 increases confidence, below 60 decreases it
    const baseAdjustment = (score - 70) / 100;
    return baseAdjustment * difficultyMultiplier[difficulty];
  }

  private calculateAdjustedLevel(
    originalLevel: number,
    challengeResult: ChallengeResult
  ): number {
    const { score, confidenceAdjustment } = challengeResult;

    // Adjust level based on performance
    let adjustment = 0;

    if (score >= 90) {
      adjustment = 5; // Strong performance suggests higher skill
    } else if (score >= 70) {
      adjustment = 2;
    } else if (score >= 50) {
      adjustment = 0; // No change
    } else if (score >= 30) {
      adjustment = -3;
    } else {
      adjustment = -5; // Poor performance suggests overestimation
    }

    // Apply confidence adjustment
    adjustment += confidenceAdjustment * 10;

    // Ensure level stays within bounds
    return Math.max(0, Math.min(100, originalLevel + adjustment));
  }

  private calculateUpdatedConfidence(
    currentConfidence: number,
    challengeResult: ChallengeResult
  ): number {
    const { score } = challengeResult;

    // High scores increase confidence, low scores decrease it
    const performanceConfidence = score / 100;

    // Weighted average with current confidence (70% new, 30% old)
    const updatedConfidence =
      performanceConfidence * 0.7 + currentConfidence * 0.3;

    return Math.max(0.1, Math.min(1, updatedConfidence));
  }

  private generateRecommendations(
    challengeResult: ChallengeResult,
    adjustedLevel: number,
    originalLevel: number
  ): string[] {
    const recommendations: string[] = [];
    const { score, feedback } = challengeResult;

    if (score < 50) {
      recommendations.push('Review fundamental concepts for this skill area');
      recommendations.push(
        'Practice with easier challenges before attempting this difficulty level'
      );
    } else if (score < 70) {
      recommendations.push(
        'Focus on edge cases and error handling in your solutions'
      );
      recommendations.push(
        'Practice similar problems to reinforce your understanding'
      );
    } else if (score >= 90) {
      recommendations.push('Consider attempting more advanced challenges');
      recommendations.push(
        'Your skills in this area are strong - consider mentoring others'
      );
    }

    if (adjustedLevel < originalLevel) {
      recommendations.push(
        'Your self-assessment may be higher than your current skill level'
      );
      recommendations.push(
        'Focus on building stronger foundations before advancing'
      );
    } else if (adjustedLevel > originalLevel) {
      recommendations.push(
        'You may be underestimating your abilities in this area'
      );
      recommendations.push('Consider taking on more challenging projects');
    }

    return recommendations;
  }

  private generateChallengeId(): string {
    return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Supporting interfaces
interface ChallengeTemplate {
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  title: string;
  prompt: string;
  expectedOutput: string;
  timeLimit: number;
  testCases: TestCase[];
  hints: string[];
}

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  weight: number;
}

// Export singleton instance
export const codingChallengeService = new CodingChallengeService();

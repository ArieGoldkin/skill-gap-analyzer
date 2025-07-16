import { AIServiceConfig } from './ai-service';

/**
 * Configuration utility for AI service settings
 */
export class AIConfigManager {
  private static readonly CONFIG_KEY = 'ai_service_config';
  private static readonly ENV_PREFIX = 'AI_SERVICE_';

  /**
   * Loads AI service configuration from environment variables and local storage
   */
  static loadConfig(): AIServiceConfig | null {
    try {
      // Try to load from environment variables first (for server-side)
      const envConfig = this.loadFromEnvironment();
      if (envConfig) {
        return envConfig;
      }

      // Fallback to local storage (for client-side)
      const storageConfig = this.loadFromStorage();
      return storageConfig;
    } catch (error) {
      console.error('Failed to load AI service configuration:', error);
      return null;
    }
  }

  /**
   * Saves configuration securely
   */
  static saveConfig(config: AIServiceConfig): void {
    try {
      // In a real application, sensitive data like API keys should be stored securely
      // This is a simplified implementation for development
      const configToStore = {
        ...config,
        apiKey: this.encryptApiKey(config.apiKey), // Basic obfuscation
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(configToStore));
      }
    } catch (error) {
      console.error('Failed to save AI service configuration:', error);
      throw new Error('Configuration save failed');
    }
  }

  /**
   * Validates configuration completeness and correctness
   */
  static validateConfig(config: Partial<AIServiceConfig>): string[] {
    const errors: string[] = [];

    if (!config.apiEndpoint) {
      errors.push('API endpoint is required');
    } else if (!this.isValidUrl(config.apiEndpoint)) {
      errors.push('API endpoint must be a valid URL');
    }

    if (!config.apiKey) {
      errors.push('API key is required');
    } else if (config.apiKey.length < 10) {
      errors.push('API key appears to be too short');
    }

    if (config.rateLimitPerHour !== undefined) {
      if (config.rateLimitPerHour < 1 || config.rateLimitPerHour > 10000) {
        errors.push('Rate limit must be between 1 and 10000 requests per hour');
      }
    }

    if (config.timeoutSeconds !== undefined) {
      if (config.timeoutSeconds < 5 || config.timeoutSeconds > 300) {
        errors.push('Timeout must be between 5 and 300 seconds');
      }
    }

    if (config.retryAttempts !== undefined) {
      if (config.retryAttempts < 0 || config.retryAttempts > 10) {
        errors.push('Retry attempts must be between 0 and 10');
      }
    }

    if (config.dataPrivacyLevel !== undefined) {
      const validLevels = ['basic', 'enhanced', 'maximum'];
      if (!validLevels.includes(config.dataPrivacyLevel)) {
        errors.push(
          'Data privacy level must be one of: basic, enhanced, maximum'
        );
      }
    }

    return errors;
  }

  /**
   * Creates a default configuration template
   */
  static createDefaultConfig(): Partial<AIServiceConfig> {
    return {
      apiEndpoint: 'https://api.example.com/v1',
      rateLimitPerHour: 100,
      timeoutSeconds: 30,
      retryAttempts: 3,
      dataPrivacyLevel: 'enhanced',
    };
  }

  /**
   * Removes stored configuration
   */
  static clearConfig(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.CONFIG_KEY);
      }
    } catch (error) {
      console.error('Failed to clear AI service configuration:', error);
    }
  }

  /**
   * Tests configuration by attempting a connection
   */
  static async testConfig(config: AIServiceConfig): Promise<{
    success: boolean;
    error?: string;
    responseTime?: number;
  }> {
    try {
      const startTime = Date.now();

      // Create a temporary service instance for testing
      const { AIIntegrationService } = await import('./ai-service');
      const service = new AIIntegrationService(config);

      const isValid = await service.validateConnection();
      const responseTime = Date.now() - startTime;

      return {
        success: isValid,
        responseTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Private helper methods

  private static loadFromEnvironment(): AIServiceConfig | null {
    if (typeof process === 'undefined' || !process.env) {
      return null;
    }

    const apiEndpoint = process.env[`${this.ENV_PREFIX}API_ENDPOINT`];
    const apiKey = process.env[`${this.ENV_PREFIX}API_KEY`];

    if (!apiEndpoint || !apiKey) {
      return null;
    }

    return {
      apiEndpoint,
      apiKey,
      rateLimitPerHour: parseInt(
        process.env[`${this.ENV_PREFIX}RATE_LIMIT`] || '100'
      ),
      timeoutSeconds: parseInt(
        process.env[`${this.ENV_PREFIX}TIMEOUT`] || '30'
      ),
      retryAttempts: parseInt(
        process.env[`${this.ENV_PREFIX}RETRY_ATTEMPTS`] || '3'
      ),
      dataPrivacyLevel:
        (process.env[`${this.ENV_PREFIX}PRIVACY_LEVEL`] as any) || 'enhanced',
    };
  }

  private static loadFromStorage(): AIServiceConfig | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem(this.CONFIG_KEY);
    if (!stored) {
      return null;
    }

    try {
      const config = JSON.parse(stored);

      // Decrypt API key
      if (config.apiKey) {
        config.apiKey = this.decryptApiKey(config.apiKey);
      }

      return config;
    } catch (error) {
      console.error('Failed to parse stored configuration:', error);
      return null;
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Basic obfuscation for API keys (not cryptographically secure)
  // In production, use proper encryption or secure storage
  private static encryptApiKey(apiKey: string): string {
    return btoa(apiKey.split('').reverse().join(''));
  }

  private static decryptApiKey(encryptedKey: string): string {
    return atob(encryptedKey).split('').reverse().join('');
  }
}

/**
 * Hook for React components to manage AI service configuration
 */
export function useAIConfig() {
  const loadConfig = () => AIConfigManager.loadConfig();
  const saveConfig = (config: AIServiceConfig) =>
    AIConfigManager.saveConfig(config);
  const validateConfig = (config: Partial<AIServiceConfig>) =>
    AIConfigManager.validateConfig(config);
  const testConfig = (config: AIServiceConfig) =>
    AIConfigManager.testConfig(config);
  const clearConfig = () => AIConfigManager.clearConfig();

  return {
    loadConfig,
    saveConfig,
    validateConfig,
    testConfig,
    clearConfig,
    createDefaultConfig: AIConfigManager.createDefaultConfig,
  };
}

// Environment variable names for documentation
export const AI_SERVICE_ENV_VARS = {
  API_ENDPOINT: 'AI_SERVICE_API_ENDPOINT',
  API_KEY: 'AI_SERVICE_API_KEY',
  RATE_LIMIT: 'AI_SERVICE_RATE_LIMIT',
  TIMEOUT: 'AI_SERVICE_TIMEOUT',
  RETRY_ATTEMPTS: 'AI_SERVICE_RETRY_ATTEMPTS',
  PRIVACY_LEVEL: 'AI_SERVICE_PRIVACY_LEVEL',
} as const;

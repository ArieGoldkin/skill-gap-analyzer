import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query configuration for the Skill Gap Analyzer
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: How long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: How long data stays in cache when unused (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      // Retry delay function (exponential backoff)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for critical data
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Background refetch interval (disabled by default)
      refetchInterval: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

/**
 * Query key factory for consistent query key patterns
 */
export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    profile: (userId: string) => ['user', 'profile', userId] as const,
    skills: (userId: string) => ['user', 'skills', userId] as const,
    assessments: (userId: string) => ['user', 'assessments', userId] as const,
  },

  // Skills-related queries
  skills: {
    all: ['skills'] as const,
    list: (filters?: Record<string, any>) =>
      ['skills', 'list', filters] as const,
    detail: (skillId: string) => ['skills', 'detail', skillId] as const,
    categories: ['skills', 'categories'] as const,
  },

  // AI Analytics queries
  analytics: {
    all: ['analytics'] as const,
    analysis: (userId: string) => ['analytics', 'analysis', userId] as const,
    recommendations: (userId: string) =>
      ['analytics', 'recommendations', userId] as const,
    progress: (userId: string) => ['analytics', 'progress', userId] as const,
  },

  // Learning paths queries
  learningPaths: {
    all: ['learning-paths'] as const,
    list: (filters?: Record<string, any>) =>
      ['learning-paths', 'list', filters] as const,
    detail: (pathId: string) => ['learning-paths', 'detail', pathId] as const,
    userPaths: (userId: string) => ['learning-paths', 'user', userId] as const,
  },

  // Market data queries
  market: {
    all: ['market'] as const,
    trends: ['market', 'trends'] as const,
    salaries: (filters?: Record<string, any>) =>
      ['market', 'salaries', filters] as const,
    demand: (skillId: string) => ['market', 'demand', skillId] as const,
  },

  // GitHub integration queries
  github: {
    all: ['github'] as const,
    profile: (username: string) => ['github', 'profile', username] as const,
    repositories: (username: string) =>
      ['github', 'repositories', username] as const,
    analysis: (username: string) => ['github', 'analysis', username] as const,
  },
} as const;

/**
 * Common query options for different data types
 */
export const queryOptions = {
  // Fast-changing data (user interactions, real-time updates)
  realtime: {
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  },

  // Frequently accessed data (user profile, skills)
  frequent: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Stable data (market trends, skill categories)
  stable: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },

  // Static data (rarely changes)
  static: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;

/**
 * Utility function to invalidate related queries
 */
export const invalidateQueries = {
  user: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.user.skills(userId) });
    queryClient.invalidateQueries({
      queryKey: queryKeys.user.assessments(userId),
    });
  },

  skills: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.skills.all });
  },

  analytics: (userId: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.analytics.analysis(userId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.analytics.recommendations(userId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.analytics.progress(userId),
    });
  },

  learningPaths: (userId?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.learningPaths.all });
    if (userId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.learningPaths.userPaths(userId),
      });
    }
  },
} as const;

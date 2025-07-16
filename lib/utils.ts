// Utility function for combining class names
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function calculateSkillGap(current: number, target: number): number {
  return Math.max(0, target - current);
}

export function getSkillLevel(score: number): string {
  if (score >= 90) return 'Expert';
  if (score >= 70) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  if (score >= 30) return 'Beginner';
  return 'Novice';
}

export function getGapSeverity(gap: number): 'low' | 'medium' | 'high' {
  if (gap <= 20) return 'low';
  if (gap <= 40) return 'medium';
  return 'high';
}

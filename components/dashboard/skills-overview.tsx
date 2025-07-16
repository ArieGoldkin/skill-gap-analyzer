import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockSkills } from '@/lib/mock-data';
import {
  calculateSkillGap,
  getGapSeverity,
  formatPercentage,
} from '@/lib/utils';
import './skills-overview.css';

export function SkillsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Overview</CardTitle>
        <CardDescription>
          Current skill levels vs target goals with market demand insights
        </CardDescription>
      </CardHeader>
      <CardContent className="skills-content">
        {mockSkills.map(skill => {
          const gap = calculateSkillGap(skill.currentLevel, skill.targetLevel);
          const gapSeverity = getGapSeverity(gap);

          const TrendIcon =
            skill.trendDirection === 'up'
              ? TrendingUp
              : skill.trendDirection === 'down'
                ? TrendingDown
                : Minus;

          return (
            <div key={skill.id} className="skill-item">
              <div className="skill-header">
                <div className="skill-info">
                  <h4 className="skill-name">{skill.name}</h4>
                  <Badge variant="secondary" className="skill-category">
                    {skill.category}
                  </Badge>
                  <div className="skill-trend">
                    <TrendIcon className="trend-icon" />
                    <span className="trend-text">
                      {formatPercentage(skill.marketDemand)} demand
                    </span>
                  </div>
                </div>
                <div className="skill-levels">
                  {skill.currentLevel}% → {skill.targetLevel}%
                </div>
              </div>

              <div className="skill-progress">
                <Progress value={skill.currentLevel} className="progress-bar" />
                {gap > 0 && (
                  <div className="skill-gap">
                    <Badge
                      variant={
                        gapSeverity === 'high'
                          ? 'destructive'
                          : gapSeverity === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                      className="gap-badge"
                    >
                      {gap}% gap
                    </Badge>
                    <span className="gap-priority">{gapSeverity} priority</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

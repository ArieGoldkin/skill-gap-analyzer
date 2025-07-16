import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, BookOpen, Award } from 'lucide-react';
import { mockSkillGapAnalysis, mockSkills } from '@/lib/mock-data';
import { formatPercentage } from '@/lib/utils';
import './overview-cards.css';

export function OverviewCards() {
  const analysis = mockSkillGapAnalysis;
  const skillsInProgress = mockSkills.filter(
    skill => skill.currentLevel < skill.targetLevel
  ).length;
  const averageProgress =
    mockSkills.reduce((acc, skill) => acc + skill.currentLevel, 0) /
    mockSkills.length;

  return (
    <div className="overview-grid">
      <Card>
        <CardHeader className="overview-card-header">
          <CardTitle className="overview-card-title">Total Skills</CardTitle>
          <Target className="overview-card-icon" />
        </CardHeader>
        <CardContent>
          <div className="overview-card-value">{analysis.totalSkills}</div>
          <p className="overview-card-description">
            {analysis.skillsWithGaps} with gaps identified
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="overview-card-header">
          <CardTitle className="overview-card-title">Average Gap</CardTitle>
          <TrendingUp className="overview-card-icon" />
        </CardHeader>
        <CardContent>
          <div className="overview-card-value">{analysis.averageGap}%</div>
          <Progress
            value={100 - analysis.averageGap}
            className="overview-progress"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="overview-card-header">
          <CardTitle className="overview-card-title">In Progress</CardTitle>
          <BookOpen className="overview-card-icon" />
        </CardHeader>
        <CardContent>
          <div className="overview-card-value">{skillsInProgress}</div>
          <p className="overview-card-description">Skills being developed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="overview-card-header">
          <CardTitle className="overview-card-title">
            Overall Progress
          </CardTitle>
          <Award className="overview-card-icon" />
        </CardHeader>
        <CardContent>
          <div className="overview-card-value">
            {formatPercentage(averageProgress)}
          </div>
          <Progress value={averageProgress} className="overview-progress" />
        </CardContent>
      </Card>
    </div>
  );
}

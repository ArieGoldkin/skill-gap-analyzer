import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Award, ExternalLink } from 'lucide-react';
import { mockLearningPaths } from '@/lib/mock-data';
import './learning-path.css';

export function LearningPath() {
  const learningPath = mockLearningPaths[0]; // Using first path as example

  return (
    <div className="learning-path-container">
      <Card>
        <CardHeader>
          <div className="path-header">
            <div className="path-info">
              <CardTitle>{learningPath.title}</CardTitle>
              <CardDescription>{learningPath.description}</CardDescription>
            </div>
            <Badge variant="outline" className="duration-badge">
              <Clock className="duration-icon" />
              {learningPath.estimatedDuration}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="path-meta">
            <div className="meta-item">
              <Award className="meta-icon" />
              {learningPath.difficulty}
            </div>
            <div className="meta-item">
              <BookOpen className="meta-icon" />
              {learningPath.resources.length} resources
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Milestones</CardTitle>
          <CardDescription>
            Track your progress through structured learning goals
          </CardDescription>
        </CardHeader>
        <CardContent className="milestones-content">
          {learningPath.milestones.map((milestone, index) => (
            <div key={milestone.id} className="milestone-item">
              <div className="milestone-header">
                <div className="milestone-info">
                  <div
                    className={`milestone-number ${
                      milestone.completed
                        ? 'milestone-number--completed'
                        : 'milestone-number--pending'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="milestone-details">
                    <h4 className="milestone-title">{milestone.title}</h4>
                    <p className="milestone-description">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className="milestone-target">
                  <div className="target-level">
                    Target: {milestone.targetLevel}%
                  </div>
                  <div className="target-duration">
                    {milestone.estimatedWeeks} weeks
                  </div>
                </div>
              </div>
              <Progress
                value={milestone.completed ? 100 : 0}
                className="milestone-progress"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Resources</CardTitle>
          <CardDescription>
            Curated learning materials to achieve your goals
          </CardDescription>
        </CardHeader>
        <CardContent className="resources-content">
          {learningPath.resources.map(resource => (
            <div key={resource.id} className="resource-item">
              <div className="resource-info">
                <h4 className="resource-title">{resource.title}</h4>
                <div className="resource-meta">
                  <span>{resource.provider}</span>
                  <span>•</span>
                  <span>{resource.duration}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="resource-type">
                    {resource.type}
                  </Badge>
                  <Badge
                    variant={resource.cost === 'free' ? 'secondary' : 'default'}
                    className="resource-cost"
                  >
                    {resource.cost}
                  </Badge>
                </div>
                <div className="resource-rating">
                  <span className="rating-value">⭐ {resource.rating}</span>
                  <span className="rating-label">rating</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="external-icon" />
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

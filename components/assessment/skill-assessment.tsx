import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { mockSkills } from "@/lib/mock-data";
import { getSkillLevel } from "@/lib/utils";
import "./skill-assessment.css";

export function SkillAssessment() {
  const [assessmentData, setAssessmentData] = useState(
    mockSkills.reduce(
      (acc, skill) => ({
        ...acc,
        [skill.id]: skill.currentLevel,
      }),
      {} as Record<string, number>
    )
  );

  const handleSkillChange = (skillId: string, value: number[]) => {
    setAssessmentData((prev) => ({
      ...prev,
      [skillId]: value[0],
    }));
  };

  const handleSaveAssessment = () => {
    console.log("Saving assessment:", assessmentData);
    // Here you would typically send the data to your backend
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Self-Assessment</CardTitle>
        <CardDescription>
          Rate your current skill level for each technology. Be honest - this
          helps create better learning paths.
        </CardDescription>
      </CardHeader>
      <CardContent className="assessment-content">
        {mockSkills.map((skill) => {
          const currentValue = assessmentData[skill.id];
          const skillLevel = getSkillLevel(currentValue);

          return (
            <div key={skill.id} className="assessment-item">
              <div className="assessment-header">
                <div className="skill-info">
                  <h4 className="skill-name">{skill.name}</h4>
                  <p className="skill-description">{skill.description}</p>
                </div>
                <div className="skill-rating">
                  <Badge variant="outline">{skillLevel}</Badge>
                  <span className="skill-percentage">{currentValue}%</span>
                </div>
              </div>

              <Slider
                value={[currentValue]}
                onValueChange={(value) => handleSkillChange(skill.id, value)}
                max={100}
                step={5}
                className="assessment-slider"
              />

              <div className="skill-levels">
                <span>Novice</span>
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
              </div>
            </div>
          );
        })}

        <div className="assessment-actions">
          <Button onClick={handleSaveAssessment} className="save-button">
            Save Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

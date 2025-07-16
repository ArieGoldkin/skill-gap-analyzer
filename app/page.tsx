"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SkillsOverview } from "@/components/dashboard/skills-overview";
import { SkillAssessment } from "@/components/assessment/skill-assessment";
import { LearningPath } from "@/components/learning/learning-path";
import { AIPromptHelper } from "@/components/ai/ai-prompt-helper";
import { Brain, BarChart3, Target, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-icon">
            <Brain className="icon-lg icon-white" />
          </div>
          <h1 className="header-title">Skill Gap Analyzer</h1>
          <p className="header-description">
            AI-powered career development and skill optimization platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-container">
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">
                <BarChart3 className="icon-sm" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="assessment">
                <Target className="icon-sm" />
                Assessment
              </TabsTrigger>
              <TabsTrigger value="learning">
                <BookOpen className="icon-sm" />
                Learning Path
              </TabsTrigger>
              <TabsTrigger value="ai-helper">
                <Brain className="icon-sm" />
                AI Helper
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="space-y-8">
              <TabsContent value="dashboard">
                <div className="content-card">
                  <OverviewCards />
                </div>
                <div className="content-card">
                  <SkillsOverview />
                </div>
              </TabsContent>

              <TabsContent value="assessment">
                <div className="content-card">
                  <SkillAssessment />
                </div>
              </TabsContent>

              <TabsContent value="learning">
                <div className="content-card">
                  <LearningPath />
                </div>
              </TabsContent>

              <TabsContent value="ai-helper">
                <AIPromptHelper />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Copy,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Check,
  ChevronDown,
} from "lucide-react";
import "./ai-prompt-helper.css";

const promptTemplates = [
  {
    id: "skill-analysis",
    title: "Skill Gap Analysis",
    description: "Analyze current skills vs market demands",
    icon: Target,
    template: `Analyze my skill profile and provide insights:

Current Skills:
- React: 75% proficiency
- TypeScript: 60% proficiency  
- Node.js: 45% proficiency
- Python: 70% proficiency
- Machine Learning: 30% proficiency
- AWS: 40% proficiency

Career Goal: Senior Full Stack Developer

Please provide:
1. Critical skill gaps for my target role
2. Market demand analysis for each skill
3. Priority ranking for skill development
4. Estimated timeline to reach proficiency goals`,
  },
  {
    id: "learning-path",
    title: "Personalized Learning Path",
    description: "Generate custom learning roadmaps",
    icon: BookOpen,
    template: `Create a personalized learning path for:

Target Skill: [SKILL_NAME]
Current Level: [CURRENT_LEVEL]%
Target Level: [TARGET_LEVEL]%
Available Time: [HOURS_PER_WEEK] hours/week
Learning Style: [visual/hands-on/reading/mixed]
Budget: [free/paid/unlimited]

Please provide:
1. Week-by-week learning schedule
2. Recommended resources (courses, books, projects)
3. Practice exercises and projects
4. Milestone checkpoints
5. Assessment methods to track progress`,
  },
  {
    id: "market-trends",
    title: "Market Trend Analysis",
    description: "Get insights on skill market demand",
    icon: TrendingUp,
    template: `Provide market analysis for these skills:

Skills to analyze:
- [SKILL_1]
- [SKILL_2]  
- [SKILL_3]

Industry: [INDUSTRY]
Location: [LOCATION]
Experience Level: [JUNIOR/MID/SENIOR]

Please analyze:
1. Current market demand and trends
2. Salary impact of each skill
3. Job market projections (next 2-3 years)
4. Complementary skills that increase value
5. Geographic demand variations`,
  },
  {
    id: "career-guidance",
    title: "Career Path Guidance",
    description: "Strategic career development advice",
    icon: Sparkles,
    template: `Provide career guidance based on my profile:

Current Role: [CURRENT_ROLE]
Experience: [YEARS] years
Target Role: [TARGET_ROLE]
Industry: [INDUSTRY]

Current Skills:
[LIST_YOUR_SKILLS]

Career Goals:
[LIST_YOUR_GOALS]

Please advise on:
1. Skill gaps for target role transition
2. Alternative career paths to consider
3. Timeline and milestones for career progression
4. Networking and experience-building strategies
5. Potential challenges and how to overcome them`,
  },
];

export function AIPromptHelper() {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [copiedTemplate, setCopiedTemplate] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId);
    if (template) {
      setCustomPrompt(template.template);
      setIsDropdownOpen(false);
    }
  };

  const copyToClipboard = async (text: string, templateId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTemplate(templateId);
      setTimeout(() => setCopiedTemplate(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="ai-helper-container">
      <div className="ai-helper-wrapper">
        {/* Introduction Section */}
        <div className="ai-helper-intro">
          <p className="intro-text">
            Use these AI-powered prompts to get personalized insights about your
            career development. Copy and paste into your favorite AI assistant
            (ChatGPT, Claude, etc.) for tailored advice.
          </p>
        </div>

        {/* Template Cards Grid */}
        <div className="templates-grid">
          {promptTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div className="template-info">
                    <div className="template-icon">
                      <IconComponent className="icon-md icon-white" />
                    </div>
                    <div className="template-details">
                      <h3 className="template-title">{template.title}</h3>
                      <p className="template-description">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="template-actions">
                  <button
                    onClick={() => handleTemplateSelect(template.id)}
                    className="template-use-btn"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() =>
                      copyToClipboard(template.template, template.id)
                    }
                    className="template-copy-btn"
                  >
                    {copiedTemplate === template.id ? (
                      <>
                        <Check className="icon-sm" />
                        <span className="copy-text copy-text--success">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="icon-sm" />
                        <span className="copy-text">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prompt Editor Section */}
        <div className="prompt-editor">
          <div className="editor-content">
            <div className="editor-header">
              <h2 className="editor-title">Customize Your Prompt</h2>
              <p className="editor-description">
                Edit the template below to match your specific situation, then
                copy to your AI assistant
              </p>
            </div>

            {/* Custom Dropdown */}
            <div className="dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-trigger"
              >
                <span className="dropdown-text">
                  Select a template to start with
                </span>
                <ChevronDown
                  className={`dropdown-icon ${
                    isDropdownOpen ? "dropdown-icon--open" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {promptTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="dropdown-item"
                    >
                      <div className="dropdown-item-title">
                        {template.title}
                      </div>
                      <div className="dropdown-item-description">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Textarea */}
            <div className="textarea-container">
              <textarea
                placeholder="Your customized AI prompt will appear here..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="prompt-textarea"
              />
            </div>

            {/* Action Buttons */}
            <div className="editor-actions">
              <button
                onClick={() => copyToClipboard(customPrompt, "custom")}
                disabled={!customPrompt.trim()}
                className="copy-prompt-btn"
              >
                {copiedTemplate === "custom" ? (
                  <>
                    <Check className="icon-sm" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="icon-sm" />
                    Copy Prompt
                  </>
                )}
              </button>
              <button onClick={() => setCustomPrompt("")} className="clear-btn">
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="pro-tips">
          <h2 className="tips-title">Pro Tips for Better AI Responses</h2>
          <div className="tips-grid">
            {[
              {
                title: "Be Specific",
                description:
                  "Replace placeholders like [SKILL_NAME] with your actual skills and goals",
                color: "tip--blue",
              },
              {
                title: "Include Context",
                description:
                  "Add your industry, experience level, and career aspirations",
                color: "tip--purple",
              },
              {
                title: "Ask Follow-ups",
                description:
                  "Request clarification or deeper analysis on specific points",
                color: "tip--green",
              },
              {
                title: "Update Regularly",
                description: "Reassess your skills and goals every few months",
                color: "tip--orange",
              },
            ].map((tip, index) => (
              <div key={index} className="tip-item">
                <div className={`tip-badge ${tip.color}`}>{tip.title}</div>
                <p className="tip-description">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

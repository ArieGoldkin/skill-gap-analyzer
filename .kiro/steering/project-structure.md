# Skill Gap Analyzer - Project Structure

## Overview

This document outlines the complete folder structure and file organization of the Skill Gap Analyzer project.

## Root Directory Structure

```
skill-gap-analyzer/
├── .kiro/                          # Kiro IDE configuration
│   └── steering/                   # Project steering files
│       ├── project-rules.md        # Development guidelines and rules
│       └── project-structure.md    # This file - project structure documentation
├── .next/                          # Next.js build output (auto-generated)
├── .vscode/                        # VS Code configuration
├── app/                            # Next.js App Router directory
│   ├── globals.css                 # Global CSS styles with design tokens
│   ├── layout.tsx                  # Root layout component
│   └── page.tsx                    # Home page component
├── components/                     # React components organized by feature
│   ├── ai/                         # AI-related components
│   │   ├── ai-prompt-helper.tsx    # AI prompt template generator
│   │   └── ai-prompt-helper.css    # Styles for AI prompt helper
│   ├── assessment/                 # Skill assessment components
│   │   ├── skill-assessment.tsx    # Self-assessment interface
│   │   └── skill-assessment.css    # Assessment component styles
│   ├── dashboard/                  # Dashboard and analytics components
│   │   ├── overview-cards.tsx      # Skill overview cards
│   │   ├── overview-cards.css      # Overview cards styles
│   │   ├── skills-overview.tsx     # Detailed skills breakdown
│   │   └── skills-overview.css     # Skills overview styles
│   ├── learning/                   # Learning path components
│   │   ├── learning-path.tsx       # Learning path display
│   │   └── learning-path.css       # Learning path styles
│   └── ui/                         # Base UI components (Radix UI based)
│       ├── badge.tsx               # Badge component
│       ├── badge.css               # Badge styles
│       ├── button.tsx              # Button component
│       ├── button.css              # Button styles
│       ├── card.tsx                # Card component
│       ├── card.css                # Card styles
│       ├── progress.tsx            # Progress bar component
│       ├── progress.css            # Progress bar styles
│       ├── select.tsx              # Select dropdown component
│       ├── select.css              # Select dropdown styles
│       ├── separator.tsx           # Separator component
│       ├── separator.css           # Separator styles
│       ├── slider.tsx              # Slider component
│       ├── slider.css              # Slider styles
│       ├── tabs.tsx                # Tabs component
│       ├── tabs.css                # Tabs styles
│       ├── textarea.tsx            # Textarea component
│       └── textarea.css            # Textarea styles
├── lib/                            # Utility libraries and helpers
│   ├── mock-data.ts                # Mock data for development
│   ├── types.ts                    # TypeScript type definitions
│   └── utils.ts                    # Utility functions
├── node_modules/                   # NPM dependencies (auto-generated)
├── .eslintrc.json                  # ESLint configuration
├── README.md                       # Project documentation
├── next-env.d.ts                   # Next.js TypeScript declarations
├── next.config.js                  # Next.js configuration
├── package-lock.json               # NPM lock file
├── package.json                    # NPM package configuration
└── tsconfig.json                   # TypeScript configuration
```

## Component Architecture

### UI Components (`components/ui/`)

All UI components follow a consistent pattern:

- **Component file** (`.tsx`): Contains the React component using Radix UI primitives
- **Style file** (`.css`): Contains component-specific CSS with semantic class names
- **No Tailwind classes**: All styling is done through custom CSS
- **Radix UI integration**: Components wrap Radix UI primitives for accessibility

### Feature Components

Each feature area has its own directory with components and styles:

- `ai/`: AI-powered features like prompt helpers
- `assessment/`: Skill assessment and evaluation tools
- `dashboard/`: Analytics and overview displays
- `learning/`: Learning path management and display

### Styling Architecture

#### Global Styles (`app/globals.css`)

- CSS custom properties for design tokens
- Base typography and layout utilities
- Color scheme and theming variables
- Responsive design utilities

#### Component Styles

- Each component has its own CSS file
- Semantic class names (e.g., `.button`, `.card-header`)
- BEM-like naming for variants (e.g., `.button--primary`, `.badge--secondary`)
- CSS custom properties for theming

## Data Layer (`lib/`)

### Types (`lib/types.ts`)

- TypeScript interfaces for all data structures
- Skill, LearningPath, Assessment, and other domain models
- API response types and form data types

### Mock Data (`lib/mock-data.ts`)

- Sample data for development and testing
- Realistic skill profiles and learning paths
- Market insights and trend data

### Utilities (`lib/utils.ts`)

- Helper functions for data manipulation
- Formatting utilities (percentages, skill levels)
- Class name combination utility (`cn` function)

## Configuration Files

### Next.js Configuration

- `next.config.js`: Next.js build and runtime configuration
- `next-env.d.ts`: TypeScript declarations for Next.js

### TypeScript Configuration

- `tsconfig.json`: TypeScript compiler options and path mapping

### Linting Configuration

- `.eslintrc.json`: ESLint rules and configuration

### Package Management

- `package.json`: Dependencies and scripts
- `package-lock.json`: Locked dependency versions

## Key Dependencies

### Core Framework

- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks and concurrent features
- **TypeScript**: Type safety and developer experience

### UI Components

- **Radix UI**: Accessible component primitives
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-progress`
  - `@radix-ui/react-slider`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - And other Radix UI primitives

### Icons

- **Lucide React**: Icon library for consistent iconography

### Charts (Future)

- **Recharts**: Data visualization library for analytics

## Development Workflow

### File Naming Conventions

- **Components**: PascalCase (e.g., `SkillAssessment.tsx`)
- **CSS files**: kebab-case matching component (e.g., `skill-assessment.css`)
- **Utility files**: kebab-case (e.g., `mock-data.ts`)
- **Type files**: kebab-case (e.g., `types.ts`)

### CSS Organization

- Global styles in `app/globals.css`
- Component styles co-located with components
- CSS custom properties for theming
- Semantic class names, no utility classes
- Responsive design with CSS media queries

### Component Structure

```tsx
// Component imports
import * as RadixPrimitive from '@radix-ui/react-*';
import { cn } from '@/lib/utils';
import './component-name.css';

// Component implementation with Radix UI
const Component = () => {
  return (
    <RadixPrimitive.Root className="semantic-class-name">
      {/* Component content */}
    </RadixPrimitive.Root>
  );
};
```

## Future Considerations

### Scalability

- Component library could be extracted to separate package
- Storybook integration for component documentation
- Design system documentation site

### Performance

- Code splitting at route level
- Component lazy loading for large features
- Image optimization and CDN integration

### Testing

- Jest and React Testing Library setup
- Component unit tests
- Integration tests for user workflows
- Accessibility testing automation

---

This structure supports maintainable, scalable development while ensuring accessibility and performance.

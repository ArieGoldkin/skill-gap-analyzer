# Skill Gap Analyzer - Project Rules & Guidelines

## Project Overview

The Skill Gap Analyzer is an AI-powered career development platform that helps users identify skill gaps, create personalized learning paths, and make data-driven career decisions.

## Development Standards

### Code Quality

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Implement proper error handling and loading states
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions

### Component Architecture

- Use functional components with hooks
- Implement proper prop typing with TypeScript interfaces
- Keep components small and focused (single responsibility)
- Use composition over inheritance
- Implement proper component lifecycle management

### File Size and Separation of Concerns

- Keep files small and focused (max 200-300 lines)
- Separate concerns into different files and modules
- Extract complex logic into custom hooks or utility functions
- Split large components into smaller, composable pieces
- Create separate files for types, constants, and utilities
- Use barrel exports (index.ts) to organize related modules

### Function Complexity

- Keep function complexity low (max cyclomatic complexity of 11)
- Break down complex functions into smaller, focused functions
- Use early returns to reduce nesting levels
- Extract conditional logic into separate functions when appropriate
- Prefer pure functions over functions with side effects

### Design System

- Use Radix UI primitives as the foundation for all interactive components
- Implement custom CSS styling with CSS variables for theming
- NO Tailwind CSS - use semantic CSS classes and proper CSS files
- NO shadcn/ui - build components directly with Radix UI primitives
- Maintain consistent design tokens through CSS custom properties
- Ensure all components are fully accessible following WCAG guidelines
- Use CSS Grid and Flexbox for layouts
- Implement proper focus management and keyboard navigation

### File Organization

```
components/
├── ui/           # Base design system components
├── ai/           # AI-related functionality
├── assessment/   # Skill assessment features
├── dashboard/    # Analytics and overview
├── learning/     # Learning path management
└── shared/       # Reusable business components
```

### State Management

- Use React hooks for local state
- Implement Context API for global state when needed
- Consider Zustand for complex state management
- Keep state as close to where it's used as possible

### Performance Guidelines

- Implement proper memoization with useMemo/useCallback
- Use React.lazy for code splitting
- Optimize images and assets
- Implement proper loading states
- Use proper key props for lists

## AI Integration Rules

### Prompt Engineering

- Create reusable prompt templates
- Include proper context and constraints
- Test prompts with multiple AI providers
- Version control prompt templates
- Document expected outputs

### Data Privacy

- Never store sensitive user data in prompts
- Implement proper data anonymization
- Follow GDPR compliance guidelines
- Provide clear privacy controls to users

### API Integration

- Implement proper rate limiting
- Add fallback mechanisms for API failures
- Cache responses when appropriate
- Monitor API usage and costs

## Testing Strategy

### Unit Testing

- Test all utility functions
- Test component rendering and interactions
- Mock external dependencies
- Aim for 80%+ code coverage

### Integration Testing

- Test user workflows end-to-end
- Test AI prompt generation and processing
- Validate data flow between components

### Accessibility Testing

- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Test with various assistive technologies

## Security Guidelines

### Data Protection

- Sanitize all user inputs
- Implement proper authentication
- Use HTTPS for all communications
- Follow OWASP security guidelines

### API Security

- Implement proper API key management
- Use environment variables for secrets
- Add request validation and sanitization
- Implement proper CORS policies

## Deployment & DevOps

### Environment Management

- Use separate environments (dev, staging, prod)
- Implement proper CI/CD pipelines
- Use environment variables for configuration
- Monitor application performance

### Database Guidelines

- Design normalized database schemas
- Implement proper indexing strategies
- Use migrations for schema changes
- Backup data regularly

## User Experience Principles

### Accessibility First

- Follow WCAG 2.1 AA guidelines
- Support keyboard navigation
- Provide proper ARIA labels
- Test with assistive technologies

### Performance

- Target < 3s initial page load
- Implement progressive loading
- Optimize for mobile devices
- Use proper caching strategies

### Usability

- Keep interfaces intuitive and simple
- Provide clear feedback for user actions
- Implement proper error messages
- Support undo/redo where appropriate

## AI Ethics & Bias Prevention

### Fairness

- Test AI recommendations across diverse user groups
- Implement bias detection in skill assessments
- Provide transparent explanations for AI decisions
- Allow users to challenge or correct AI outputs

### Transparency

- Clearly indicate when AI is being used
- Explain how recommendations are generated
- Provide confidence scores for AI outputs
- Allow users to see and edit their data

## Business Logic Rules

### Skill Assessment

- Validate skill levels are between 0-100
- Ensure target levels are >= current levels
- Implement proper skill categorization
- Track assessment history and changes

### Learning Paths

- Validate learning resource quality
- Ensure proper difficulty progression
- Track completion rates and effectiveness
- Update recommendations based on user feedback

### Market Data

- Validate data sources and freshness
- Implement proper data aggregation
- Handle missing or incomplete data gracefully
- Provide confidence indicators for predictions

## Documentation Requirements

### Code Documentation

- Document all public APIs
- Provide usage examples
- Maintain up-to-date README files
- Document deployment procedures

### User Documentation

- Create user guides for all features
- Provide video tutorials for complex workflows
- Maintain FAQ and troubleshooting guides
- Document AI prompt usage and best practices

## Monitoring & Analytics

### Application Monitoring

- Track application performance metrics
- Monitor error rates and types
- Implement proper logging
- Set up alerting for critical issues

### User Analytics

- Track feature usage and adoption
- Monitor user engagement metrics
- Analyze learning path effectiveness
- Measure skill improvement outcomes

## Compliance & Legal

### Data Compliance

- Follow GDPR requirements
- Implement proper data retention policies
- Provide data export and deletion capabilities
- Maintain audit logs for data access

### Content Licensing

- Ensure proper licensing for learning resources
- Respect copyright and intellectual property
- Implement proper attribution systems
- Monitor for license compliance

---

These rules should be followed by all contributors to ensure consistency, quality, and maintainability of the Skill Gap Analyzer platform.

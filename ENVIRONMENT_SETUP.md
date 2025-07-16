# Environment Setup Guide

This guide will help you set up the Skill Gap Analyzer project with proper environment configuration and GitHub Actions.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git configured
- GitHub account (for Actions and integrations)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd skill-gap-analyzer
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```bash
# Required for basic functionality
AI_SERVICE_API_ENDPOINT=https://your-ai-service.com/v1
AI_SERVICE_API_KEY=your_actual_api_key

# Optional for GitHub integration
GITHUB_ACCESS_TOKEN=ghp_your_github_token

# Generate secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔐 Environment Variables Guide

### Required Variables

| Variable                  | Description                | Example                                 |
| ------------------------- | -------------------------- | --------------------------------------- |
| `AI_SERVICE_API_ENDPOINT` | Your AI service API URL    | `https://api.openai.com/v1`             |
| `AI_SERVICE_API_KEY`      | API key for AI service     | `sk-...`                                |
| `NEXTAUTH_SECRET`         | NextAuth.js encryption key | Generate with `openssl rand -base64 32` |

### Optional Variables

| Variable                   | Description         | Default    |
| -------------------------- | ------------------- | ---------- |
| `GITHUB_ACCESS_TOKEN`      | GitHub API token    | None       |
| `AI_SERVICE_RATE_LIMIT`    | Requests per hour   | `100`      |
| `AI_SERVICE_PRIVACY_LEVEL` | Data privacy level  | `enhanced` |
| `MOCK_AI_SERVICE`          | Use mock AI service | `false`    |

### Security Variables

| Variable          | Description        | How to Generate           |
| ----------------- | ------------------ | ------------------------- |
| `NEXTAUTH_SECRET` | NextAuth.js secret | `openssl rand -base64 32` |
| `JWT_SECRET`      | JWT signing key    | `openssl rand -base64 64` |
| `SESSION_SECRET`  | Session encryption | `openssl rand -base64 32` |

## 🔧 GitHub Actions Setup

### 1. Repository Secrets

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

#### Required Secrets

```
# AI Service
AI_SERVICE_API_KEY=your_production_api_key
STAGING_AI_API_KEY=your_staging_api_key
PRODUCTION_AI_API_KEY=your_production_api_key

# Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# URLs
STAGING_APP_URL=https://your-app-staging.vercel.app
PRODUCTION_APP_URL=https://your-app.com
STAGING_AI_API_ENDPOINT=https://staging-api.your-service.com
PRODUCTION_AI_API_ENDPOINT=https://api.your-service.com
```

#### Optional Secrets

```
# Security Scanning
SNYK_TOKEN=your_snyk_token
CODECOV_TOKEN=your_codecov_token

# Performance Monitoring
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token
```

### 2. Environment Configuration

Create environment-specific configurations in GitHub:

1. Go to `Settings > Environments`
2. Create `staging` and `production` environments
3. Add environment-specific secrets and variables

### 3. Branch Protection

Set up branch protection rules:

1. Go to `Settings > Branches`
2. Add rule for `main` branch:
   - Require status checks to pass
   - Require branches to be up to date
   - Require review from code owners
   - Dismiss stale reviews

## 🧪 Testing Setup

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

## 📊 Monitoring & Analytics

### Performance Monitoring

The project includes Lighthouse CI for performance monitoring:

```bash
npm install -g @lhci/cli
lhci autorun
```

### Security Scanning

Automated security scans run on:

- Every push to main
- Daily at 2 AM UTC
- Pull requests

Manual security scan:

```bash
npm audit
npx snyk test
```

## 🚀 Deployment

### Staging Deployment

Automatic deployment to staging occurs when:

- Code is pushed to `develop` branch
- All tests pass

### Production Deployment

Automatic deployment to production occurs when:

- Code is pushed to `main` branch
- All tests and security checks pass

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔍 Troubleshooting

### Common Issues

#### Environment Variables Not Loading

```bash
# Check if .env.local exists
ls -la .env*

# Verify environment variables
npm run dev -- --debug
```

#### GitHub Actions Failing

1. Check secrets are properly set
2. Verify branch protection rules
3. Check workflow permissions

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# In .env.local
DEBUG=true
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Environment Variables Best Practices](https://12factor.net/config)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Set up your environment following this guide
4. Make your changes
5. Run tests and linting
6. Submit a pull request

## 📞 Support

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Security**: See [SECURITY.md](.github/SECURITY.md) for security issues

---

Happy coding! 🎉

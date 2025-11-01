# Contributing to TimeWarp LoL

Thank you for your interest in contributing to TimeWarp LoL! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Feature Requests](#feature-requests)
8. [Bug Reports](#bug-reports)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and constructive in all interactions
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or insults
- Publishing others' private information
- Trolling or deliberate disruption

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of TypeScript/React
- Familiarity with League of Legends (helpful but not required)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/timewarp-lol.git
   cd timewarp-lol
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original/timewarp-lol.git
   ```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

---

## Development Workflow

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes

### Make Your Changes

1. Write clean, readable code
2. Follow the coding standards (see below)
3. Add tests for new functionality
4. Update documentation as needed

### Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "Add champion mastery achievement calculation

- Implemented logic to detect champion mastery milestones
- Added tests for achievement generation
- Updated types to include mastery levels"
```

Commit message format:
- First line: Brief summary (50 chars or less)
- Blank line
- Detailed description (wrap at 72 chars)
- Reference issues: "Fixes #123" or "Closes #456"

### Keep Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide explicit types for function parameters and return values
- Avoid `any` type; use `unknown` if necessary
- Use interfaces for object shapes

**Good**:
```typescript
interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
}

function calculateKDA(stats: PlayerStats): number {
  if (stats.deaths === 0) {
    return stats.kills + stats.assists;
  }
  return (stats.kills + stats.assists) / stats.deaths;
}
```

**Bad**:
```typescript
function calculateKDA(stats: any) {
  return (stats.kills + stats.assists) / stats.deaths;
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for prop types
- Avoid prop drilling; use context when needed

**Good**:
```typescript
interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}

export default function SummaryCard({ title, value, subtitle, icon }: SummaryCardProps) {
  return (
    <div className="card">
      {/* Component content */}
    </div>
  );
}
```

### File Organization

```
components/
├── ComponentName.tsx       # Component implementation
└── ComponentName.test.tsx  # Component tests

services/
├── serviceName.ts          # Service implementation
└── serviceName.test.ts     # Service tests
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (e.g., `ChampionStats`)
- **Functions**: camelCase (e.g., `calculateKDA`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_MATCHES`)
- **Types/Interfaces**: PascalCase (e.g., `PlayerStats`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at end of statements
- Use trailing commas in objects/arrays
- Max line length: 100 characters

Run the linter:
```bash
npm run lint
```

---

## Testing Guidelines

### Unit Tests

Test individual functions and components:

```typescript
describe('calculateKDA', () => {
  it('should calculate KDA correctly', () => {
    const stats = { kills: 10, deaths: 5, assists: 15 };
    expect(calculateKDA(stats)).toBe(5);
  });

  it('should handle zero deaths', () => {
    const stats = { kills: 10, deaths: 0, assists: 5 };
    expect(calculateKDA(stats)).toBe(15);
  });
});
```

### Integration Tests

Test service integrations:

```typescript
describe('RiotAPI', () => {
  it('should fetch player data', async () => {
    const player = await riotApi.getPlayerByName('TestPlayer', 'NA');
    expect(player.success).toBe(true);
    expect(player.data?.summonerName).toBe('TestPlayer');
  });
});
```

### Running Tests

```bash
npm test                # Run all tests
npm test -- --watch     # Run tests in watch mode
npm test -- --coverage  # Generate coverage report
```

---

## Pull Request Process

### Before Submitting

1. ✅ All tests pass
2. ✅ Code follows style guidelines
3. ✅ Documentation is updated
4. ✅ No merge conflicts with main branch
5. ✅ Commit messages are clear

### Submit PR

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What does this PR do?
   - **Motivation**: Why is this change needed?
   - **Testing**: How was this tested?
   - **Screenshots**: If UI changes, include screenshots

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR

---

## Feature Requests

Have an idea for a new feature?

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with the "feature request" label
3. **Describe the feature**:
   - What problem does it solve?
   - How should it work?
   - Any implementation ideas?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples.
```

---

## Bug Reports

Found a bug? Help us fix it!

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with the "bug" label
3. **Provide details**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Node version: [e.g., 18.17.0]

**Additional context**
Any other context about the problem.
```

---

## Areas We Need Help

Here are some areas where contributions are especially welcome:

### High Priority
- [ ] Mobile responsive design improvements
- [ ] Additional achievement types
- [ ] Performance optimizations
- [ ] Accessibility improvements (WCAG compliance)

### Medium Priority
- [ ] Unit test coverage improvements
- [ ] Documentation improvements
- [ ] UI/UX enhancements
- [ ] Error handling improvements

### Low Priority
- [ ] Additional visualization types
- [ ] Social sharing enhancements
- [ ] Internationalization (i18n)
- [ ] Dark mode alternatives

---

## Recognition

Contributors will be recognized in:
- [README.md](README.md) contributors section
- GitHub contributors page
- Release notes for significant contributions

---

## Questions?

- Open a [GitHub Discussion](https://github.com/yourusername/timewarp-lol/discussions)
- Join our Discord community (if available)
- Email: [maintainer email]

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to TimeWarp LoL! Together we can create an amazing experience for the League of Legends community.** 🎮✨

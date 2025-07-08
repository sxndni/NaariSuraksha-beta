# Contributing to NaariSuraksha

Thank you for your interest in contributing to NaariSuraksha! This project aims to enhance women's safety through technology, and we welcome contributions from developers, designers, and safety experts.

## 🌟 How to Contribute

### 🐛 Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Include detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Browser and device information

### 💡 Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Use the feature request template**
3. **Explain the use case** and how it improves women's safety
4. **Consider the emergency context** - will this help in critical situations?

### 🔧 Code Contributions

#### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

#### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/naarisuraksha-beta.git
   cd naarisuraksha-beta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your Clerk publishable key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Development Guidelines

##### Code Style
- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS classes, mobile-first approach
- **Icons**: Use Lucide React icons consistently
- **Naming**: Descriptive names, PascalCase for components

##### Safety-First Development
- **Emergency features** should be accessible within 2 taps
- **Critical functions** must work offline when possible
- **Location services** should be accurate and fast
- **UI should be usable** in high-stress situations

##### File Organization
- Components in `/src/components/`
- Pages in `/src/pages/`
- Contexts in `/src/contexts/`
- Types in appropriate files with clear interfaces

#### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Ensure responsive design
   - Test emergency scenarios

3. **Test thoroughly**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add emergency contact quick dial feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out the PR template** with:
   - Description of changes
   - Safety impact assessment
   - Testing performed
   - Screenshots/videos

### 📱 Testing Guidelines

#### Manual Testing Checklist
- [ ] **Mobile responsiveness** on various screen sizes
- [ ] **Emergency flows** work under stress
- [ ] **Location services** are accurate
- [ ] **Offline functionality** where applicable
- [ ] **Accessibility** for users with disabilities
- [ ] **Performance** on slower devices/networks

#### Emergency Scenario Testing
- [ ] **SOS activation** works quickly
- [ ] **Contact calling** functions properly
- [ ] **Location sharing** is accurate
- [ ] **Map services** load emergency locations
- [ ] **AI assistant** provides helpful responses

## 🎨 Design Contributions

### UI/UX Guidelines
- **Emergency-first design**: Critical features prominently displayed
- **High contrast**: Ensure visibility in various lighting conditions
- **Large touch targets**: Easy to use in stressful situations
- **Clear hierarchy**: Important actions stand out
- **Consistent patterns**: Familiar interactions across the app

### Design Assets
- Use the existing color palette (pink/purple gradient theme)
- Maintain consistent spacing (Tailwind's spacing scale)
- Icons should be from Lucide React library
- Ensure designs work on both light and dark themes

## 🔒 Security Considerations

### Privacy & Data Protection
- **Minimal data collection**: Only collect what's necessary for safety
- **Secure storage**: Use encrypted storage for sensitive data
- **Location privacy**: Clear controls over location sharing
- **Emergency override**: Safety features should override privacy when needed

### Code Security
- **Input validation**: Sanitize all user inputs
- **API security**: Secure all external API calls
- **Authentication**: Proper session management
- **Emergency access**: Ensure critical features work even if auth fails

## 📋 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `emergency-critical` - Affects emergency functionality
- `mobile` - Mobile-specific issues
- `accessibility` - Accessibility improvements
- `security` - Security-related issues
- `documentation` - Documentation improvements

## 🚀 Release Process

1. **Feature freeze** for upcoming release
2. **Testing phase** with focus on emergency scenarios
3. **Security review** of all changes
4. **Performance testing** on various devices
5. **Beta deployment** for community testing
6. **Production release** with monitoring

## 💬 Community Guidelines

### Code of Conduct
- **Be respectful** and inclusive
- **Focus on safety** and user well-being
- **Constructive feedback** only
- **No discrimination** based on any factor
- **Emergency context awareness** in all discussions

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code discussions
- **Discussions**: General questions and ideas

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special recognition for safety-critical improvements

## 📞 Emergency Contact

If you discover a **security vulnerability** or **safety-critical bug**:
1. **Do NOT** create a public issue
2. **Email directly**: [security@naarisuraksha.com] (when available)
3. **Include details** but keep it confidential until fixed

---

**Thank you for helping make the world safer for women! 🛡️**

*Every contribution, no matter how small, makes a difference in someone's safety.*
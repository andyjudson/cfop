# Cubing App Constitution

## Project Principles

### Educational Focus
This application exists to help users (namely me) learn Rubik's cube solving methods, specifically the CFOP (Cross, F2L, OLL, PLL) system. All features must support this educational goal.

### Open Source & Accessibility
- Code should be open source and freely available
- Content should be accessible to users worldwide
- No paywalls or premium features that restrict learning

### Technical Excellence
- Use modern, maintainable web technologies
- Prioritize performance and user experience
- Follow web standards and best practices
- Consider cross-platform compatibility but essentially macOS and iOS

## Constraints & Boundaries

### Content Ownership
- Content based on publicly available CFOP methods
- Avoid direct copying of proprietary tutorial content
- Respect copyright of external educational materials
- Keep implementation private to avoid commercial conflicts

### Technology Choices
- Web-first approach with React ecosystem
- Mobile deployment via Capacitor or PWA (no native iOS licensing)
- Cubing.js for cube visualizations (maintained library on github)
- Algorithm sets should be maintained in json
- Prefer lite or minimalist css, js, html frameworks
- Minimal dependencies to ensure long-term maintainability

### Scope Limitations
- Focus exclusively on CFOP method learning (intuitive + 3-look, 2-look, 1-look levels)
- Limited tracking features, at most a scramble generator and timer for personal use so can stay in one app
- No social or competitive features or user accounts
- No monetization or advertising

## Quality Standards

### Code Quality
- TypeScript for type safety
- Comprehensive testing (unit + e2e)
- Clean, documented code following React best practices
- Regular dependency updates and security reviews

### User Experience
- Intuitive navigation and information hierarchy
- Fast loading and responsive interactions
- Accessible design for all users
- Consistent visual design across platforms

### Performance Requirements
- Fast initial load times
- Smooth cube animations and interactions
- Efficient data structures and rendering
- Minimal bundle size for web deployment

## Development Guidelines

### Architecture Decisions
- Component-based React architecture
- State management via React hooks
- Local storage for user data persistence
- CDN delivery for external dependencies

### Deployment Strategy
- Web deployment as primary platform (e.g. running locally)
- Mobile apps via Capacitor or PWA for enhanced experience
- No server-side requirements (static hosting)
- Offline-capable for algorithm reference when traveling

### Maintenance Approach
- Regular framework and dependency updates
- Backward compatibility for user data
- Documentation of architectural decisions
- Clear separation of concerns in codebase

## Success Criteria

### User Value
- Users can effectively learn CFOP algorithms
- Progress tracking helps maintain motivation
- Mobile accessibility enables learning anywhere
- Reliable performance across devices

### Technical Sustainability
- Codebase remains maintainable over time
- Dependencies stay current and secure
- Build process is reliable and fast
- Documentation supports future development

### Educational Impact
- Content remains accurate and up-to-date
- Learning experience is engaging and effective
- Community can contribute improvements
- Project serves as educational resource
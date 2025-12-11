# Troubleshooting Guide

This guide helps you resolve common issues when contributing to or developing the ABMind Course Portal.

## Table of Contents

- [Content Issues](#content-issues)
- [Build Issues](#build-issues)
- [Development Issues](#development-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

## Content Issues

### YAML Syntax Errors

#### Problem: Invalid YAML syntax
```
YAMLException: can not read a block mapping entry; a multiline key may not be an implicit key
```

**Solutions:**
1. Check indentation - use exactly 2 spaces, no tabs
2. Ensure proper array formatting:
   ```yaml
   # Correct
   tags:
     - "tag1"
     - "tag2"
   
   # Incorrect
   tags:
   - "tag1"
   - "tag2"
   ```
3. Quote strings with special characters:
   ```yaml
   # Correct
   title: "Agent-Based Modeling: An Introduction"
   
   # May cause issues
   title: Agent-Based Modeling: An Introduction
   ```

#### Problem: Duplicate keys
```
YAMLException: duplicated mapping key
```

**Solution:** Ensure each key appears only once in the same object level.

### Schema Validation Errors

#### Problem: Missing required fields
```
Validation failed: "title" is required
```

**Solution:** Add all required fields according to the schema:
- Course: id, title, type, year, difficulty, tags, instructors, language, summary, sessions, last_updated
- Resource: id, title, type, url, tags, description, language
- Learning Path: id, title, description, recommended_audience, estimated_duration, steps

#### Problem: Invalid enum values
```
Validation failed: "type" must be one of [course, workshop, reading_group]
```

**Solution:** Use only allowed values:
- Course type: `course`, `workshop`, `reading_group`
- Difficulty: `beginner`, `intermediate`, `advanced`
- Language: `zh`, `en`
- Resource type: `docs`, `tutorial`, `paper`, `book`, `dataset`, `tool`

#### Problem: Invalid date format
```
Validation failed: "last_updated" must be in YYYY-MM-DD format
```

**Solution:** Use ISO date format: `2024-12-11`

### Reference Errors

#### Problem: Referenced course/resource not found
```
Learning path references non-existent course: "missing-course-id"
```

**Solution:** 
1. Check that the referenced course/resource exists
2. Verify the ID matches exactly (case-sensitive)
3. Ensure the referenced file is in the correct directory

### URL Validation Issues

#### Problem: Invalid URL format
```
Validation failed: "url" must be a valid URL
```

**Solutions:**
1. Include protocol: `https://example.com` not `example.com`
2. Ensure proper encoding of special characters
3. Test URLs manually to ensure they work

## Build Issues

### TypeScript Compilation Errors

#### Problem: Type errors during build
```
Type error: Property 'xyz' does not exist on type 'Course'
```

**Solutions:**
1. Check type definitions in `src/types/index.ts`
2. Ensure data structure matches TypeScript interfaces
3. Update types if adding new fields

#### Problem: Import/export errors
```
Module not found: Can't resolve '@/lib/data'
```

**Solutions:**
1. Check file paths and ensure files exist
2. Verify import statements use correct paths
3. Check `tsconfig.json` path mapping configuration

### Next.js Build Issues

#### Problem: Static generation fails
```
Error: Failed to collect page data for /courses/[id]
```

**Solutions:**
1. Ensure all course files have valid YAML syntax
2. Check that dynamic routes can access required data
3. Verify data loading functions handle errors properly

#### Problem: Memory issues during build
```
JavaScript heap out of memory
```

**Solutions:**
1. Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`
2. Optimize data processing to handle large datasets
3. Consider pagination for large course collections

## Development Issues

### Local Development Server

#### Problem: Server won't start
```
Error: Port 3000 is already in use
```

**Solutions:**
1. Kill existing process: `lsof -ti:3000 | xargs kill -9`
2. Use different port: `npm run dev -- -p 3001`
3. Check for other applications using the port

#### Problem: Hot reload not working
**Solutions:**
1. Restart development server
2. Clear Next.js cache: `rm -rf .next`
3. Check file watching limits on Linux: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`

### Testing Issues

#### Problem: Tests failing due to missing mocks
```
ReferenceError: IntersectionObserver is not defined
```

**Solution:** Add mocks to `src/test-setup.ts`:
```typescript
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

#### Problem: Property-based tests failing
```
Property failed after X tests
```

**Solutions:**
1. Check test generators produce valid data
2. Verify property assertions are correct
3. Use `fc.assert` with `verbose: true` for debugging
4. Ensure test data matches expected schema

### Dependency Issues

#### Problem: Package installation fails
```
npm ERR! peer dep missing
```

**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check Node.js version compatibility
4. Use `npm install --legacy-peer-deps` if needed

## Deployment Issues

### Vercel Deployment

#### Problem: Build fails on Vercel
```
Build failed with exit code 1
```

**Solutions:**
1. Check build logs for specific errors
2. Ensure environment variables are set correctly
3. Verify Node.js version matches local development
4. Test build locally: `npm run build`

#### Problem: Static export issues
```
Error: Image Optimization using Next.js' default loader is not compatible with `next export`
```

**Solutions:**
1. Configure image optimization for static export
2. Use external image optimization service
3. Disable image optimization if not needed

### GitHub Pages Deployment

#### Problem: 404 errors on GitHub Pages
**Solutions:**
1. Ensure `basePath` is configured correctly in `next.config.js`
2. Check that all asset paths are relative
3. Verify GitHub Pages is enabled for the repository

### Environment Configuration

#### Problem: Environment variables not working
**Solutions:**
1. Check variable names start with `NEXT_PUBLIC_` for client-side access
2. Verify variables are set in deployment environment
3. Restart development server after adding variables

## Performance Issues

### Slow Build Times

#### Problem: Build takes too long
**Solutions:**
1. Enable incremental builds in `next.config.js`
2. Optimize data processing functions
3. Use build caching strategies
4. Consider splitting large data files

### Runtime Performance

#### Problem: Slow page loads
**Solutions:**
1. Optimize images and assets
2. Implement code splitting
3. Use static generation for better performance
4. Enable compression and caching

#### Problem: Search is slow
**Solutions:**
1. Implement search indexing
2. Use debouncing for search input
3. Limit search results
4. Consider server-side search for large datasets

### Memory Usage

#### Problem: High memory usage
**Solutions:**
1. Optimize data structures
2. Implement pagination for large lists
3. Use lazy loading for components
4. Profile memory usage with browser dev tools

## Getting Help

### Debugging Steps

1. **Check the console** for error messages
2. **Review logs** in development/build output
3. **Test in isolation** - create minimal reproduction
4. **Check documentation** for similar issues
5. **Search existing issues** on GitHub

### Useful Commands

```bash
# Validate all content
npm run validate:all

# Check TypeScript types
npm run type-check

# Run linting
npm run lint

# Format code
npm run format

# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install

# Build for production
npm run build

# Analyze bundle size
npm run analyze
```

### Log Analysis

#### Development Logs
- Check browser console for client-side errors
- Review terminal output for server-side issues
- Use React Developer Tools for component debugging

#### Build Logs
- Look for TypeScript compilation errors
- Check for missing dependencies
- Review static generation warnings

#### Deployment Logs
- Check Vercel/GitHub Actions logs
- Look for environment variable issues
- Review asset optimization problems

### Common File Locations

- **Configuration**: `next.config.ts`, `tsconfig.json`, `package.json`
- **Data**: `data/courses/`, `data/resources.yaml`, `data/learning_paths.yaml`
- **Types**: `src/types/index.ts`
- **Tests**: `src/**/__tests__/`
- **Validation**: `scripts/validate-content.js`

### When to Open an Issue

Open a GitHub issue when:
- You've followed troubleshooting steps without success
- You've found a bug in the codebase
- You need a new feature or enhancement
- Documentation is unclear or missing

Include in your issue:
- **Environment details** (Node.js version, OS, browser)
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Error messages** and logs
- **Minimal reproduction** if possible

### Community Resources

- **GitHub Discussions**: For questions and community help
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Documentation**: README.md and CONTRIBUTING.md

Remember: Most issues have been encountered before. Check existing documentation and issues first, then don't hesitate to ask for help!
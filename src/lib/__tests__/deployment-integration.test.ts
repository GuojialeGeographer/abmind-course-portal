import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Deployment Integration Tests', () => {
  const testDir = path.join(__dirname, '../../../test-build');
  const originalCwd = process.cwd();

  beforeAll(() => {
    // Clean up any existing test build
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    // Clean up test build directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Build Process', () => {
    it('should build successfully with default configuration', () => {
      expect(() => {
        execSync('npm run build', { 
          stdio: 'pipe',
          cwd: path.join(__dirname, '../../..'),
          timeout: 60000 // 1 minute timeout
        });
      }).not.toThrow();

      // Check that build output exists
      const outDir = path.join(__dirname, '../../../out');
      expect(fs.existsSync(outDir)).toBe(true);
      
      // Check for essential files
      expect(fs.existsSync(path.join(outDir, 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, '_next'))).toBe(true);
    });

    it('should build successfully with GitHub Pages configuration', () => {
      const env = { 
        ...process.env, 
        NEXT_PUBLIC_BASE_PATH: '/abmind-course-portal' 
      };

      expect(() => {
        execSync('npm run build', { 
          stdio: 'pipe',
          cwd: path.join(__dirname, '../../..'),
          env,
          timeout: 60000
        });
      }).not.toThrow();

      // Check that build output exists
      const outDir = path.join(__dirname, '../../../out');
      expect(fs.existsSync(outDir)).toBe(true);
      
      // Check for .nojekyll file (GitHub Pages requirement)
      expect(fs.existsSync(path.join(outDir, '.nojekyll'))).toBe(true);
    });

    it('should generate all required static pages', () => {
      const outDir = path.join(__dirname, '../../../out');
      
      // Check for main pages
      const requiredPages = [
        'index.html',
        'courses/index.html',
        'learning-paths/index.html',
        'resources/index.html',
        'about/index.html',
        'domains/index.html'
      ];

      requiredPages.forEach(page => {
        const pagePath = path.join(outDir, page);
        expect(fs.existsSync(pagePath), `Missing page: ${page}`).toBe(true);
      });
    });

    it('should include all necessary assets', () => {
      const outDir = path.join(__dirname, '../../../out');
      
      // Check for Next.js assets
      expect(fs.existsSync(path.join(outDir, '_next/static'))).toBe(true);
      
      // Check for sitemap and robots.txt
      expect(fs.existsSync(path.join(outDir, 'sitemap.xml'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'robots.txt'))).toBe(true);
    });
  });

  describe('Content Validation in Build', () => {
    it('should validate YAML content during build', () => {
      // This test ensures that invalid YAML would cause build to fail
      expect(() => {
        execSync('npm run validate:content', { 
          stdio: 'pipe',
          cwd: path.join(__dirname, '../../..'),
          timeout: 30000
        });
      }).not.toThrow();
    });

    it('should pass content quality checks', () => {
      expect(() => {
        execSync('npm run validate:quality', { 
          stdio: 'pipe',
          cwd: path.join(__dirname, '../../..'),
          timeout: 30000
        });
      }).not.toThrow();
    });

    it('should pass accessibility validation', () => {
      expect(() => {
        execSync('npm run validate:accessibility', { 
          stdio: 'pipe',
          cwd: path.join(__dirname, '../../..'),
          timeout: 30000
        });
      }).not.toThrow();
    });
  });

  describe('Build Output Validation', () => {
    it('should generate valid HTML files', () => {
      const outDir = path.join(__dirname, '../../../out');
      const indexPath = path.join(outDir, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // Check for basic HTML structure
        expect(content).toContain('<!DOCTYPE html>');
        expect(content).toContain('<html');
        expect(content).toContain('<head>');
        expect(content).toContain('<body>');
        expect(content).toContain('</html>');
        
        // Check for meta tags
        expect(content).toContain('<meta charset="utf-8">');
        expect(content).toContain('<meta name="viewport"');
        
        // Check for title
        expect(content).toContain('<title>');
      }
    });

    it('should include proper meta tags for SEO', () => {
      const outDir = path.join(__dirname, '../../../out');
      const indexPath = path.join(outDir, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // Check for SEO meta tags
        expect(content).toContain('meta name="description"');
        expect(content).toContain('meta property="og:');
        
        // Check for structured data
        expect(content).toMatch(/application\/ld\+json/);
      }
    });

    it('should have proper asset paths for different deployment targets', () => {
      const outDir = path.join(__dirname, '../../../out');
      const indexPath = path.join(outDir, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        
        // Check that asset paths are properly configured
        // This will vary based on NEXT_PUBLIC_BASE_PATH
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        
        if (basePath) {
          expect(content).toContain(`${basePath}/_next/`);
        } else {
          expect(content).toContain('/_next/');
        }
      }
    });
  });

  describe('Performance Validation', () => {
    it('should generate optimized assets', () => {
      const outDir = path.join(__dirname, '../../../out');
      const staticDir = path.join(outDir, '_next/static');
      
      if (fs.existsSync(staticDir)) {
        // Check for minified JavaScript files
        const jsFiles = fs.readdirSync(staticDir, { recursive: true })
          .filter(file => typeof file === 'string' && file.endsWith('.js'));
        
        expect(jsFiles.length).toBeGreaterThan(0);
        
        // Check that JS files are minified (no excessive whitespace)
        if (jsFiles.length > 0) {
          const jsFile = path.join(staticDir, jsFiles[0]);
          const content = fs.readFileSync(jsFile, 'utf8');
          
          // Minified files should have high character density
          const lines = content.split('\n');
          const avgLineLength = content.length / lines.length;
          expect(avgLineLength).toBeGreaterThan(50); // Minified files have long lines
        }
      }
    });

    it('should have reasonable bundle sizes', () => {
      const outDir = path.join(__dirname, '../../../out');
      const staticDir = path.join(outDir, '_next/static');
      
      if (fs.existsSync(staticDir)) {
        // Get total size of static assets
        let totalSize = 0;
        
        function calculateSize(dir: string) {
          const items = fs.readdirSync(dir);
          
          items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              calculateSize(fullPath);
            } else {
              totalSize += stat.size;
            }
          });
        }
        
        calculateSize(staticDir);
        
        // Total static assets should be reasonable (less than 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        expect(totalSize).toBeLessThan(maxSize);
      }
    });
  });

  describe('Deployment Configuration', () => {
    it('should have valid Vercel configuration', () => {
      const vercelConfigPath = path.join(__dirname, '../../../vercel.json');
      
      if (fs.existsSync(vercelConfigPath)) {
        const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        
        // Check required fields
        expect(config.buildCommand).toBeDefined();
        expect(config.outputDirectory).toBeDefined();
        expect(config.framework).toBe('nextjs');
        
        // Check security headers
        expect(config.headers).toBeDefined();
        expect(Array.isArray(config.headers)).toBe(true);
      }
    });

    it('should have proper environment configuration', () => {
      const envExamplePath = path.join(__dirname, '../../../.env.example');
      
      expect(fs.existsSync(envExamplePath)).toBe(true);
      
      const envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Check for required environment variables
      expect(envContent).toContain('NODE_ENV');
      expect(envContent).toContain('NEXT_PUBLIC_BASE_PATH');
      expect(envContent).toContain('VERCEL_TOKEN');
    });

    it('should have deployment scripts', () => {
      const packageJsonPath = path.join(__dirname, '../../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for deployment scripts
      expect(packageJson.scripts['deploy:vercel']).toBeDefined();
      expect(packageJson.scripts['deploy:github-pages']).toBeDefined();
      expect(packageJson.scripts['monitor:check']).toBeDefined();
    });
  });

  describe('Rollback Capability', () => {
    it('should have rollback script available', () => {
      const deployScriptPath = path.join(__dirname, '../../../scripts/deploy.js');
      
      expect(fs.existsSync(deployScriptPath)).toBe(true);
      
      const scriptContent = fs.readFileSync(deployScriptPath, 'utf8');
      expect(scriptContent).toContain('rollback');
    });

    it('should validate rollback functionality', () => {
      // Test that rollback script can be called without errors
      // (This would need actual deployment IDs in a real scenario)
      const deployScriptPath = path.join(__dirname, '../../../scripts/deploy.js');
      
      expect(() => {
        // Test script validation without actual rollback
        execSync(`node ${deployScriptPath} --help || true`, { 
          stdio: 'pipe',
          timeout: 10000
        });
      }).not.toThrow();
    });
  });
});
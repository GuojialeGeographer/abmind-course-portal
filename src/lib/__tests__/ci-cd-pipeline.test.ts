import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('CI/CD Pipeline Tests', () => {
  describe('GitHub Actions Workflows', () => {
    it('should have main CI/CD workflow', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/ci-cd.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
      
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      // Check workflow structure
      expect(workflow.name).toBe('CI/CD Pipeline');
      expect(workflow.on).toBeDefined();
      expect(workflow.jobs).toBeDefined();
      
      // Check required jobs
      expect(workflow.jobs.validate).toBeDefined();
      expect(workflow.jobs.test).toBeDefined();
      expect(workflow.jobs.build).toBeDefined();
      expect(workflow.jobs['deploy-vercel']).toBeDefined();
      expect(workflow.jobs['deploy-github-pages']).toBeDefined();
    });

    it('should have staging deployment workflow', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/staging.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
      
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      expect(workflow.name).toBe('Staging Deployment');
      expect(workflow.jobs['deploy-staging']).toBeDefined();
    });

    it('should have security workflow', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/security.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
      
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      expect(workflow.name).toBe('Security & Dependency Checks');
      expect(workflow.jobs['security-audit']).toBeDefined();
      expect(workflow.jobs['dependency-update']).toBeDefined();
    });

    it('should have monitoring workflow', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/monitoring.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
      
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      expect(workflow.name).toBe('Site Monitoring');
      expect(workflow.jobs['uptime-check']).toBeDefined();
      expect(workflow.jobs['performance-check']).toBeDefined();
    });
  });

  describe('Workflow Job Dependencies', () => {
    it('should have proper job dependencies in main workflow', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      // Test job should depend on validate
      expect(workflow.jobs.test.needs).toContain('validate');
      
      // Build job should depend on both validate and test
      expect(workflow.jobs.build.needs).toEqual(['validate', 'test']);
      
      // Deploy jobs should depend on build
      expect(workflow.jobs['deploy-vercel'].needs).toContain('build');
      expect(workflow.jobs['deploy-github-pages'].needs).toContain('build');
    });

    it('should have proper conditional deployment', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      // Deploy jobs should only run on main branch pushes
      expect(workflow.jobs['deploy-vercel'].if).toContain('main');
      expect(workflow.jobs['deploy-github-pages'].if).toContain('main');
    });
  });

  describe('Validation Scripts', () => {
    it('should have content validation script', () => {
      const scriptPath = path.join(__dirname, '../../../scripts/validate-content.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).toContain('ContentValidator');
      expect(scriptContent).toContain('validateYamlFile');
      expect(scriptContent).toContain('checkUrl');
    });

    it('should have accessibility testing script', () => {
      const scriptPath = path.join(__dirname, '../../../scripts/accessibility-test.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).toContain('AccessibilityTester');
      expect(scriptContent).toContain('runAccessibilityTests');
    });

    it('should have content quality checker', () => {
      const scriptPath = path.join(__dirname, '../../../scripts/content-quality.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).toContain('ContentQualityChecker');
      expect(scriptContent).toContain('checkTextQuality');
    });
  });

  describe('Deployment Scripts', () => {
    it('should have deployment manager script', () => {
      const scriptPath = path.join(__dirname, '../../../scripts/deploy.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).toContain('DeploymentManager');
      expect(scriptContent).toContain('deployToVercel');
      expect(scriptContent).toContain('deployToGitHubPages');
      expect(scriptContent).toContain('rollback');
    });

    it('should have monitoring script', () => {
      const scriptPath = path.join(__dirname, '../../../scripts/monitor.js');
      expect(fs.existsSync(scriptPath)).toBe(true);
      
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      expect(scriptContent).toContain('UptimeMonitor');
      expect(scriptContent).toContain('checkUrl');
      expect(scriptContent).toContain('generateReport');
    });
  });

  describe('Package.json Scripts', () => {
    it('should have all required npm scripts', () => {
      const packageJsonPath = path.join(__dirname, '../../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredScripts = [
        'build',
        'test',
        'lint',
        'validate:content',
        'validate:accessibility',
        'validate:quality',
        'validate:all',
        'deploy:vercel',
        'deploy:vercel-prod',
        'deploy:github-pages',
        'monitor:check',
        'monitor:report'
      ];
      
      requiredScripts.forEach(script => {
        expect(packageJson.scripts[script]).toBeDefined();
      });
    });

    it('should have proper script commands', () => {
      const packageJsonPath = path.join(__dirname, '../../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check that validation scripts point to correct files
      expect(packageJson.scripts['validate:content']).toContain('validate-content.js');
      expect(packageJson.scripts['validate:accessibility']).toContain('accessibility-test.js');
      expect(packageJson.scripts['validate:quality']).toContain('content-quality.js');
      
      // Check that deployment scripts point to correct files
      expect(packageJson.scripts['deploy:vercel']).toContain('deploy.js vercel');
      expect(packageJson.scripts['deploy:github-pages']).toContain('deploy.js github-pages');
    });
  });

  describe('Environment Configuration', () => {
    it('should have environment example file', () => {
      const envPath = path.join(__dirname, '../../../.env.example');
      expect(fs.existsSync(envPath)).toBe(true);
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check for required environment variables
      const requiredVars = [
        'NODE_ENV',
        'NEXT_PUBLIC_BASE_PATH',
        'NEXT_PUBLIC_SITE_URL',
        'VERCEL_TOKEN',
        'VERCEL_ORG_ID',
        'VERCEL_PROJECT_ID'
      ];
      
      requiredVars.forEach(varName => {
        expect(envContent).toContain(varName);
      });
    });

    it('should have proper Next.js configuration for deployment', () => {
      const configPath = path.join(__dirname, '../../../next.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
      
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Check for static export configuration
      expect(configContent).toContain('output: \'export\'');
      expect(configContent).toContain('basePath');
      expect(configContent).toContain('assetPrefix');
    });

    it('should have Vercel configuration', () => {
      const vercelConfigPath = path.join(__dirname, '../../../vercel.json');
      expect(fs.existsSync(vercelConfigPath)).toBe(true);
      
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      
      // Check essential configuration
      expect(config.buildCommand).toBe('npm run build');
      expect(config.outputDirectory).toBe('out');
      expect(config.framework).toBe('nextjs');
      
      // Check security headers
      expect(config.headers).toBeDefined();
      expect(Array.isArray(config.headers)).toBe(true);
    });
  });

  describe('Error Handling and Notifications', () => {
    it('should have failure notification in main workflow', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/ci-cd.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      expect(workflow.jobs['notify-failure']).toBeDefined();
      expect(workflow.jobs['notify-failure'].if).toBe('failure()');
    });

    it('should have monitoring alerts', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/monitoring.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      expect(workflow.jobs['notify-issues']).toBeDefined();
      expect(workflow.jobs['notify-issues'].if).toBe('failure()');
    });
  });

  describe('Security Configuration', () => {
    it('should have security workflow with proper checks', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/security.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      // Check for security audit job
      const securityJob = workflow.jobs['security-audit'];
      expect(securityJob).toBeDefined();
      
      // Check for audit steps
      const auditStep = securityJob.steps.find((step: any) => 
        step.name === 'Run security audit'
      );
      expect(auditStep).toBeDefined();
      expect(auditStep.run).toContain('npm audit');
    });

    it('should have dependency update automation', () => {
      const workflowPath = path.join(__dirname, '../../../.github/workflows/security.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflow = yaml.load(workflowContent) as any;
      
      // Check for dependency update job
      const depJob = workflow.jobs['dependency-update'];
      expect(depJob).toBeDefined();
      expect(depJob.if).toContain('schedule');
    });
  });
});
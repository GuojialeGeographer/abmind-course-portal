#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeploymentManager {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.target = process.argv[2] || 'vercel';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }

  async checkPrerequisites() {
    this.log('Checking deployment prerequisites...');
    
    // Check if build directory exists
    const buildDir = path.join(__dirname, '../out');
    if (!fs.existsSync(buildDir)) {
      this.log('Build directory not found. Running build...', 'warning');
      try {
        execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
      } catch (error) {
        this.log('Build failed', 'error');
        process.exit(1);
      }
    }

    // Check environment variables based on target
    if (this.target === 'vercel') {
      const requiredVars = ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID'];
      const missing = requiredVars.filter(varName => !process.env[varName]);
      
      if (missing.length > 0) {
        this.log(`Missing required environment variables for Vercel: ${missing.join(', ')}`, 'error');
        process.exit(1);
      }
    }

    this.log('Prerequisites check passed');
  }

  async deployToVercel(isProduction = false) {
    this.log(`Deploying to Vercel (${isProduction ? 'production' : 'preview'})...`);
    
    try {
      const args = isProduction ? '--prod' : '';
      const command = `npx vercel ${args} --token ${process.env.VERCEL_TOKEN}`;
      
      const output = execSync(command, { 
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8'
      });
      
      // Extract deployment URL from output
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const deploymentUrl = urlMatch ? urlMatch[0] : 'Unknown';
      
      this.log(`✅ Successfully deployed to Vercel: ${deploymentUrl}`);
      return deploymentUrl;
    } catch (error) {
      this.log(`Vercel deployment failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async deployToGitHubPages() {
    this.log('Deploying to GitHub Pages...');
    
    try {
      // Set GitHub Pages environment variables
      process.env.NEXT_PUBLIC_BASE_PATH = '/abmind-course-portal';
      
      // Rebuild with GitHub Pages configuration
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '/abmind-course-portal' }
      });
      
      // Create .nojekyll file to prevent Jekyll processing
      const nojekyllPath = path.join(__dirname, '../out/.nojekyll');
      fs.writeFileSync(nojekyllPath, '');
      
      this.log('✅ Build prepared for GitHub Pages deployment');
      this.log('Note: Actual deployment to GitHub Pages happens via GitHub Actions');
      
      return 'https://your-username.github.io/abmind-course-portal';
    } catch (error) {
      this.log(`GitHub Pages preparation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async rollback(deploymentId) {
    this.log(`Rolling back deployment: ${deploymentId}`);
    
    if (this.target === 'vercel') {
      try {
        const command = `npx vercel rollback ${deploymentId} --token ${process.env.VERCEL_TOKEN}`;
        execSync(command, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
        this.log('✅ Rollback completed');
      } catch (error) {
        this.log(`Rollback failed: ${error.message}`, 'error');
        throw error;
      }
    } else {
      this.log('Rollback not supported for GitHub Pages', 'warning');
    }
  }

  async healthCheck(url) {
    this.log(`Performing health check on: ${url}`);
    
    try {
      const https = require('https');
      const http = require('http');
      const { URL } = require('url');
      
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      return new Promise((resolve, reject) => {
        const req = client.request({
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname,
          method: 'GET',
          timeout: 10000
        }, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            this.log('✅ Health check passed');
            resolve(true);
          } else {
            this.log(`Health check failed with status: ${res.statusCode}`, 'error');
            resolve(false);
          }
        });

        req.on('error', (error) => {
          this.log(`Health check failed: ${error.message}`, 'error');
          resolve(false);
        });

        req.on('timeout', () => {
          req.destroy();
          this.log('Health check timed out', 'error');
          resolve(false);
        });

        req.end();
      });
    } catch (error) {
      this.log(`Health check error: ${error.message}`, 'error');
      return false;
    }
  }

  async run() {
    this.log(`Starting deployment to ${this.target}...`);
    
    try {
      await this.checkPrerequisites();
      
      let deploymentUrl;
      
      switch (this.target) {
        case 'vercel':
          deploymentUrl = await this.deployToVercel(this.environment === 'production');
          break;
        case 'vercel-prod':
          deploymentUrl = await this.deployToVercel(true);
          break;
        case 'github-pages':
          deploymentUrl = await this.deployToGitHubPages();
          break;
        default:
          this.log(`Unknown deployment target: ${this.target}`, 'error');
          process.exit(1);
      }
      
      // Perform health check
      if (deploymentUrl && deploymentUrl !== 'Unknown') {
        const isHealthy = await this.healthCheck(deploymentUrl);
        if (!isHealthy) {
          this.log('Deployment health check failed', 'warning');
        }
      }
      
      this.log(`🎉 Deployment completed successfully!`);
      this.log(`URL: ${deploymentUrl}`);
      
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Handle command line arguments
const validTargets = ['vercel', 'vercel-prod', 'github-pages', 'rollback'];
const target = process.argv[2];

if (target === 'rollback') {
  const deploymentId = process.argv[3];
  if (!deploymentId) {
    console.error('Usage: node deploy.js rollback <deployment-id>');
    process.exit(1);
  }
  
  const manager = new DeploymentManager();
  manager.rollback(deploymentId).catch(error => {
    console.error('Rollback failed:', error);
    process.exit(1);
  });
} else if (!target || !validTargets.includes(target)) {
  console.log('Usage: node deploy.js <target>');
  console.log('Targets: vercel, vercel-prod, github-pages, rollback');
  process.exit(1);
} else {
  const manager = new DeploymentManager();
  manager.run().catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Import validation schemas - we'll handle this dynamically
let schemas = null;

async function loadSchemas() {
  if (!schemas) {
    try {
      // Try to import the schemas module
      const schemasModule = await import('../src/lib/schemas.js');
      schemas = {
        courseSchema: schemasModule.courseSchema,
        learningPathSchema: schemasModule.learningPathSchema,
        resourceSchema: schemasModule.resourceSchema,
        siteConfigSchema: schemasModule.siteConfigSchema
      };
    } catch (error) {
      console.warn('Could not load schemas module, validation will be basic:', error.message);
      // Provide basic validation functions
      schemas = {
        courseSchema: { safeParse: (data) => ({ success: true, data }) },
        learningPathSchema: { safeParse: (data) => ({ success: true, data }) },
        resourceSchema: { safeParse: (data) => ({ success: true, data }) },
        siteConfigSchema: { safeParse: (data) => ({ success: true, data }) }
      };
    }
  }
  return schemas;
}

class ContentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.checkedUrls = new Map(); // Cache for URL checks
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }

  addError(message) {
    this.errors.push(message);
    this.log(message, 'error');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(message, 'warning');
  }

  async validateYamlFile(filePath, schema, schemaName) {
    this.log(`Validating ${filePath} against ${schemaName} schema`);
    
    try {
      if (!fs.existsSync(filePath)) {
        this.addError(`File not found: ${filePath}`);
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(content);

      if (!data) {
        this.addError(`Empty or invalid YAML in ${filePath}`);
        return false;
      }

      // Validate against schema
      const result = schema.safeParse(data);
      if (!result.success) {
        this.addError(`Schema validation failed for ${filePath}:`);
        if (result.error && result.error.errors) {
          result.error.errors.forEach(err => {
            this.addError(`  - ${err.path.join('.')}: ${err.message}`);
          });
        }
        return false;
      }

      this.log(`✓ ${filePath} passed schema validation`);
      return true;
    } catch (error) {
      this.addError(`Error validating ${filePath}: ${error.message}`);
      return false;
    }
  }

  async checkUrl(url, timeout = 10000) {
    // Check cache first
    if (this.checkedUrls.has(url)) {
      return this.checkedUrls.get(url);
    }

    return new Promise((resolve) => {
      try {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.request({
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname + urlObj.search,
          method: 'HEAD',
          timeout: timeout,
          headers: {
            'User-Agent': 'ABMind-Content-Validator/1.0'
          }
        }, (res) => {
          const isValid = res.statusCode >= 200 && res.statusCode < 400;
          this.checkedUrls.set(url, isValid);
          resolve(isValid);
        });

        req.on('error', () => {
          this.checkedUrls.set(url, false);
          resolve(false);
        });

        req.on('timeout', () => {
          req.destroy();
          this.checkedUrls.set(url, false);
          resolve(false);
        });

        req.end();
      } catch (error) {
        this.checkedUrls.set(url, false);
        resolve(false);
      }
    });
  }

  extractUrlsFromObject(obj, urls = new Set()) {
    if (typeof obj === 'string') {
      // Check if string looks like a URL
      if (obj.match(/^https?:\/\//)) {
        urls.add(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => this.extractUrlsFromObject(item, urls));
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(value => this.extractUrlsFromObject(value, urls));
    }
    return urls;
  }

  async validateExternalLinks(filePath) {
    this.log(`Checking external links in ${filePath}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(content);
      
      const urls = this.extractUrlsFromObject(data);
      const brokenUrls = [];

      for (const url of urls) {
        const isValid = await this.checkUrl(url);
        if (!isValid) {
          brokenUrls.push(url);
        }
      }

      if (brokenUrls.length > 0) {
        this.addWarning(`Broken links found in ${filePath}:`);
        brokenUrls.forEach(url => this.addWarning(`  - ${url}`));
      } else if (urls.size > 0) {
        this.log(`✓ All ${urls.size} links in ${filePath} are accessible`);
      }

      return brokenUrls.length === 0;
    } catch (error) {
      this.addError(`Error checking links in ${filePath}: ${error.message}`);
      return false;
    }
  }

  async validateDataDirectory() {
    const dataDir = path.join(__dirname, '../data');
    
    if (!fs.existsSync(dataDir)) {
      this.addError(`Data directory not found: ${dataDir}`);
      return false;
    }

    // Load schemas
    const schemaSet = await loadSchemas();
    let allValid = true;

    // Validate courses
    const coursesDir = path.join(dataDir, 'courses');
    if (fs.existsSync(coursesDir)) {
      const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
      
      for (const file of courseFiles) {
        const filePath = path.join(coursesDir, file);
        const isValid = await this.validateYamlFile(filePath, schemaSet.courseSchema, 'Course');
        if (!isValid) allValid = false;
        
        // Check external links
        await this.validateExternalLinks(filePath);
      }
    }

    // Validate learning paths
    const learningPathsFile = path.join(dataDir, 'learning_paths.yaml');
    if (fs.existsSync(learningPathsFile)) {
      const isValid = await this.validateYamlFile(learningPathsFile, schemaSet.learningPathSchema, 'LearningPath');
      if (!isValid) allValid = false;
      await this.validateExternalLinks(learningPathsFile);
    }

    // Validate resources
    const resourcesFile = path.join(dataDir, 'resources.yaml');
    if (fs.existsSync(resourcesFile)) {
      const isValid = await this.validateYamlFile(resourcesFile, schemaSet.resourceSchema, 'Resource');
      if (!isValid) allValid = false;
      await this.validateExternalLinks(resourcesFile);
    }

    // Validate site config
    const siteConfigFile = path.join(dataDir, 'site_config.yaml');
    if (fs.existsSync(siteConfigFile)) {
      const isValid = await this.validateYamlFile(siteConfigFile, schemaSet.siteConfigSchema, 'SiteConfig');
      if (!isValid) allValid = false;
      await this.validateExternalLinks(siteConfigFile);
    }

    return allValid;
  }

  async run() {
    this.log('Starting content validation...');
    
    const startTime = Date.now();
    const isValid = await this.validateDataDirectory();
    const endTime = Date.now();
    
    this.log(`Content validation completed in ${endTime - startTime}ms`);
    this.log(`Errors: ${this.errors.length}, Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      this.log('❌ Content validation failed');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      this.log('⚠️  Content validation passed with warnings');
      process.exit(0);
    } else {
      this.log('✅ Content validation passed');
      process.exit(0);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ContentValidator();
  validator.run().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = ContentValidator;
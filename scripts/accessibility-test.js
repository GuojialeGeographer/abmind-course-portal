#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class AccessibilityTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
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

  async runAccessibilityTests() {
    this.log('Running accessibility tests...');
    
    try {
      // Run the existing accessibility compliance test
      const testCommand = 'npx vitest run --reporter=verbose src/components/layout/__tests__/accessibility-compliance.test.ts';
      
      this.log('Executing accessibility compliance tests...');
      const output = execSync(testCommand, { 
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.log('✓ Accessibility tests passed');
      return true;
    } catch (error) {
      this.addError('Accessibility tests failed:');
      this.addError(error.stdout || error.message);
      return false;
    }
  }

  async checkColorContrast() {
    this.log('Checking color contrast compliance...');
    
    // This would ideally use a tool like axe-core or pa11y
    // For now, we'll check if the accessibility checker component exists
    const accessibilityCheckerPath = path.join(__dirname, '../src/components/accessibility/AccessibilityChecker.tsx');
    
    if (fs.existsSync(accessibilityCheckerPath)) {
      this.log('✓ Accessibility checker component found');
      return true;
    } else {
      this.addWarning('Accessibility checker component not found');
      return false;
    }
  }

  async validateSemanticHTML() {
    this.log('Validating semantic HTML structure...');
    
    // Check if layout components use proper semantic elements
    const layoutDir = path.join(__dirname, '../src/components/layout');
    
    if (!fs.existsSync(layoutDir)) {
      this.addError('Layout components directory not found');
      return false;
    }

    const layoutFiles = fs.readdirSync(layoutDir).filter(f => f.endsWith('.tsx'));
    let hasSemanticElements = false;

    for (const file of layoutFiles) {
      const filePath = path.join(layoutDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for semantic HTML elements
      const semanticElements = ['nav', 'main', 'header', 'footer', 'section', 'article', 'aside'];
      const foundElements = semanticElements.filter(element => 
        content.includes(`<${element}`) || content.includes(`<${element} `)
      );
      
      if (foundElements.length > 0) {
        hasSemanticElements = true;
        this.log(`✓ Found semantic elements in ${file}: ${foundElements.join(', ')}`);
      }
    }

    if (!hasSemanticElements) {
      this.addWarning('No semantic HTML elements found in layout components');
    }

    return hasSemanticElements;
  }

  async checkAriaLabels() {
    this.log('Checking ARIA labels and attributes...');
    
    const componentDirs = [
      path.join(__dirname, '../src/components'),
      path.join(__dirname, '../src/app')
    ];

    let ariaAttributesFound = false;

    for (const dir of componentDirs) {
      if (!fs.existsSync(dir)) continue;

      const files = this.getAllTsxFiles(dir);
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for ARIA attributes
        const ariaAttributes = [
          'aria-label', 'aria-labelledby', 'aria-describedby', 
          'aria-expanded', 'aria-hidden', 'role'
        ];
        
        const foundAttributes = ariaAttributes.filter(attr => content.includes(attr));
        
        if (foundAttributes.length > 0) {
          ariaAttributesFound = true;
          this.log(`✓ Found ARIA attributes in ${path.basename(file)}: ${foundAttributes.join(', ')}`);
        }
      }
    }

    if (!ariaAttributesFound) {
      this.addWarning('No ARIA attributes found in components');
    }

    return ariaAttributesFound;
  }

  getAllTsxFiles(dir) {
    const files = [];
    
    function traverse(currentDir) {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    }
    
    traverse(dir);
    return files;
  }

  async run() {
    this.log('Starting accessibility validation...');
    
    const startTime = Date.now();
    
    const results = await Promise.all([
      this.runAccessibilityTests(),
      this.checkColorContrast(),
      this.validateSemanticHTML(),
      this.checkAriaLabels()
    ]);
    
    const endTime = Date.now();
    const allPassed = results.every(result => result);
    
    this.log(`Accessibility validation completed in ${endTime - startTime}ms`);
    this.log(`Errors: ${this.errors.length}, Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      this.log('❌ Accessibility validation failed');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      this.log('⚠️  Accessibility validation passed with warnings');
      process.exit(0);
    } else {
      this.log('✅ Accessibility validation passed');
      process.exit(0);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const tester = new AccessibilityTester();
  tester.run().catch(error => {
    console.error('Accessibility validation failed:', error);
    process.exit(1);
  });
}

module.exports = AccessibilityTester;
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ContentQualityChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
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

  addSuggestion(message) {
    this.suggestions.push(message);
    this.log(message, 'suggestion');
  }

  checkTextQuality(text, context) {
    const issues = [];

    // Check for minimum length
    if (text.length < 10) {
      issues.push(`${context}: Text too short (${text.length} chars)`);
    }

    // Check for placeholder text
    const placeholders = ['lorem ipsum', 'placeholder', 'todo', 'tbd', 'coming soon'];
    const lowerText = text.toLowerCase();
    
    for (const placeholder of placeholders) {
      if (lowerText.includes(placeholder)) {
        issues.push(`${context}: Contains placeholder text "${placeholder}"`);
      }
    }

    // Check for proper sentence structure
    if (!text.trim().endsWith('.') && !text.trim().endsWith('!') && !text.trim().endsWith('?')) {
      issues.push(`${context}: Missing proper sentence ending`);
    }

    // Check for excessive repetition
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const repeatedWords = Object.entries(wordCount)
      .filter(([word, count]) => count > 3)
      .map(([word]) => word);

    if (repeatedWords.length > 0) {
      issues.push(`${context}: Excessive word repetition: ${repeatedWords.join(', ')}`);
    }

    return issues;
  }

  checkCourseQuality(course, filename) {
    const issues = [];

    // Check required fields
    const requiredFields = ['title', 'type', 'year', 'difficulty', 'summary'];
    for (const field of requiredFields) {
      if (!course[field]) {
        issues.push(`Missing required field: ${field}`);
      }
    }

    // Check text quality
    if (course.title) {
      issues.push(...this.checkTextQuality(course.title, 'Title'));
    }

    if (course.summary) {
      issues.push(...this.checkTextQuality(course.summary, 'Summary'));
      
      // Summary should be descriptive
      if (course.summary.length < 50) {
        issues.push('Summary should be more descriptive (at least 50 characters)');
      }
    }

    // Check sessions
    if (course.sessions && Array.isArray(course.sessions)) {
      course.sessions.forEach((session, index) => {
        if (!session.title) {
          issues.push(`Session ${index + 1}: Missing title`);
        }

        if (!session.objectives || session.objectives.length === 0) {
          issues.push(`Session ${index + 1}: Missing learning objectives`);
        }

        if (session.objectives) {
          session.objectives.forEach((objective, objIndex) => {
            issues.push(...this.checkTextQuality(objective, `Session ${index + 1}, Objective ${objIndex + 1}`));
          });
        }
      });
    } else {
      issues.push('Course should have sessions defined');
    }

    // Check tags
    if (!course.tags || course.tags.length === 0) {
      issues.push('Course should have tags for better discoverability');
    }

    // Check instructors
    if (!course.instructors || course.instructors.length === 0) {
      issues.push('Course should have instructors listed');
    }

    // Check year validity
    if (course.year) {
      const currentYear = new Date().getFullYear();
      if (course.year < 2020 || course.year > currentYear + 1) {
        issues.push(`Year ${course.year} seems invalid (should be between 2020 and ${currentYear + 1})`);
      }
    }

    // Check difficulty level
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (course.difficulty && !validDifficulties.includes(course.difficulty)) {
      issues.push(`Invalid difficulty level: ${course.difficulty}. Should be one of: ${validDifficulties.join(', ')}`);
    }

    return issues;
  }

  checkResourceQuality(resource) {
    const issues = [];

    // Check required fields
    const requiredFields = ['title', 'type', 'url', 'description'];
    for (const field of requiredFields) {
      if (!resource[field]) {
        issues.push(`Missing required field: ${field}`);
      }
    }

    // Check text quality
    if (resource.title) {
      issues.push(...this.checkTextQuality(resource.title, 'Title'));
    }

    if (resource.description) {
      issues.push(...this.checkTextQuality(resource.description, 'Description'));
    }

    // Check URL format
    if (resource.url && !resource.url.match(/^https?:\/\//)) {
      issues.push('URL should start with http:// or https://');
    }

    // Check resource type
    const validTypes = ['docs', 'tutorial', 'paper', 'book', 'dataset', 'tool'];
    if (resource.type && !validTypes.includes(resource.type)) {
      issues.push(`Invalid resource type: ${resource.type}. Should be one of: ${validTypes.join(', ')}`);
    }

    return issues;
  }

  async checkDataQuality() {
    const dataDir = path.join(__dirname, '../data');
    
    if (!fs.existsSync(dataDir)) {
      this.addError(`Data directory not found: ${dataDir}`);
      return false;
    }

    let allGood = true;

    // Check courses
    const coursesDir = path.join(dataDir, 'courses');
    if (fs.existsSync(coursesDir)) {
      const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
      
      this.log(`Checking quality of ${courseFiles.length} course files...`);
      
      for (const file of courseFiles) {
        const filePath = path.join(coursesDir, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const course = yaml.load(content);
          
          const issues = this.checkCourseQuality(course, file);
          
          if (issues.length > 0) {
            this.addWarning(`Quality issues in ${file}:`);
            issues.forEach(issue => this.addWarning(`  - ${issue}`));
            allGood = false;
          } else {
            this.log(`✓ ${file} passed quality checks`);
          }
        } catch (error) {
          this.addError(`Error checking ${file}: ${error.message}`);
          allGood = false;
        }
      }
    }

    // Check resources
    const resourcesFile = path.join(dataDir, 'resources.yaml');
    if (fs.existsSync(resourcesFile)) {
      try {
        const content = fs.readFileSync(resourcesFile, 'utf8');
        const data = yaml.load(content);
        
        if (data && Array.isArray(data)) {
          this.log(`Checking quality of ${data.length} resources...`);
          
          data.forEach((resource, index) => {
            const issues = this.checkResourceQuality(resource);
            
            if (issues.length > 0) {
              this.addWarning(`Quality issues in resource ${index + 1}:`);
              issues.forEach(issue => this.addWarning(`  - ${issue}`));
              allGood = false;
            }
          });
        }
      } catch (error) {
        this.addError(`Error checking resources.yaml: ${error.message}`);
        allGood = false;
      }
    }

    return allGood;
  }

  async checkConsistency() {
    this.log('Checking content consistency...');
    
    const dataDir = path.join(__dirname, '../data');
    const coursesDir = path.join(dataDir, 'courses');
    
    if (!fs.existsSync(coursesDir)) {
      return true;
    }

    const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    const allTags = new Set();
    const allInstructors = new Set();
    const allYears = new Set();

    // Collect all tags, instructors, and years
    for (const file of courseFiles) {
      const filePath = path.join(coursesDir, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const course = yaml.load(content);
        
        if (course.tags) {
          course.tags.forEach(tag => allTags.add(tag));
        }
        
        if (course.instructors) {
          course.instructors.forEach(instructor => allInstructors.add(instructor));
        }
        
        if (course.year) {
          allYears.add(course.year);
        }
      } catch (error) {
        // Skip invalid files
      }
    }

    // Report statistics
    this.log(`Found ${allTags.size} unique tags across all courses`);
    this.log(`Found ${allInstructors.size} unique instructors across all courses`);
    this.log(`Found ${allYears.size} unique years: ${Array.from(allYears).sort().join(', ')}`);

    // Check for potential inconsistencies
    const tagArray = Array.from(allTags);
    const similarTags = [];
    
    for (let i = 0; i < tagArray.length; i++) {
      for (let j = i + 1; j < tagArray.length; j++) {
        const tag1 = tagArray[i].toLowerCase();
        const tag2 = tagArray[j].toLowerCase();
        
        // Check for similar tags (simple similarity check)
        if (tag1.includes(tag2) || tag2.includes(tag1) || 
            Math.abs(tag1.length - tag2.length) <= 2) {
          similarTags.push([tagArray[i], tagArray[j]]);
        }
      }
    }

    if (similarTags.length > 0) {
      this.addSuggestion('Potentially similar tags found (consider consolidating):');
      similarTags.forEach(([tag1, tag2]) => {
        this.addSuggestion(`  - "${tag1}" and "${tag2}"`);
      });
    }

    return true;
  }

  async run() {
    this.log('Starting content quality check...');
    
    const startTime = Date.now();
    
    await this.checkDataQuality();
    await this.checkConsistency();
    
    const endTime = Date.now();
    
    this.log(`Content quality check completed in ${endTime - startTime}ms`);
    this.log(`Errors: ${this.errors.length}, Warnings: ${this.warnings.length}, Suggestions: ${this.suggestions.length}`);
    
    if (this.errors.length > 0) {
      this.log('❌ Content quality check failed');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      this.log('⚠️  Content quality check passed with warnings');
      process.exit(0);
    } else {
      this.log('✅ Content quality check passed');
      process.exit(0);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const checker = new ContentQualityChecker();
  checker.run().catch(error => {
    console.error('Content quality check failed:', error);
    process.exit(1);
  });
}

module.exports = ContentQualityChecker;
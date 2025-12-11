import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  parseCourse,
  parseLearningPaths,
  parseResources,
  parseSiteConfig,
} from '../yaml-parser';

describe('Sample Data Validation', () => {
  it('should validate all sample course files', () => {
    const courseFiles = [
      'sample-course.yaml',
      'mesa-workshop-2024.yaml',
      'urban-modeling-2023.yaml',
    ];

    courseFiles.forEach(filename => {
      const filePath = join(process.cwd(), 'data', 'courses', filename);
      const content = readFileSync(filePath, 'utf-8');
      
      expect(() => {
        const course = parseCourse(content);
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('sessions');
      }).not.toThrow();
    });
  });

  it('should validate learning paths file', () => {
    const filePath = join(process.cwd(), 'data', 'learning_paths.yaml');
    const content = readFileSync(filePath, 'utf-8');
    
    expect(() => {
      const paths = parseLearningPaths(content);
      expect(paths.length).toBeGreaterThan(0);
      paths.forEach(path => {
        expect(path).toHaveProperty('id');
        expect(path).toHaveProperty('title');
        expect(path).toHaveProperty('steps');
        expect(path.steps.length).toBeGreaterThan(0);
      });
    }).not.toThrow();
  });

  it('should validate resources file', () => {
    const filePath = join(process.cwd(), 'data', 'resources.yaml');
    const content = readFileSync(filePath, 'utf-8');
    
    expect(() => {
      const resources = parseResources(content);
      expect(resources.length).toBeGreaterThan(0);
      resources.forEach(resource => {
        expect(resource).toHaveProperty('id');
        expect(resource).toHaveProperty('title');
        expect(resource).toHaveProperty('url');
        expect(resource).toHaveProperty('type');
      });
    }).not.toThrow();
  });

  it('should validate site config file', () => {
    const filePath = join(process.cwd(), 'data', 'site_config.yaml');
    const content = readFileSync(filePath, 'utf-8');
    
    expect(() => {
      const config = parseSiteConfig(content);
      expect(config).toHaveProperty('site_info');
      expect(config).toHaveProperty('navigation');
      expect(config.navigation.length).toBeGreaterThan(0);
      expect(config.site_info).toHaveProperty('title');
      expect(config.site_info).toHaveProperty('description');
    }).not.toThrow();
  });
});
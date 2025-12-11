import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Course, LearningPath, Resource, SiteConfig } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

// Build-time caching for static generation
const cache = new Map<string, any>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes for development

interface CacheEntry {
  data: any;
  timestamp: number;
}

function getCacheKey(filePath: string): string {
  const stats = fs.statSync(filePath);
  return `${filePath}:${stats.mtime.getTime()}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry | undefined;
  if (!entry) return null;
  
  // In production (static build), cache indefinitely
  if (process.env.NODE_ENV === 'production') {
    return entry.data;
  }
  
  // In development, respect TTL
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function loadYamlFile<T>(filePath: string): T {
  const cacheKey = getCacheKey(filePath);
  const cached = getFromCache<T>(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents) as T;
  
  setCache(cacheKey, data);
  return data;
}

export async function loadSiteConfig(): Promise<SiteConfig> {
  const filePath = path.join(dataDir, 'site_config.yaml');
  return loadYamlFile<SiteConfig>(filePath);
}

export async function loadCourses(): Promise<Course[]> {
  const coursesDir = path.join(dataDir, 'courses');
  const cacheKey = `courses:${coursesDir}`;
  
  // Check if we have cached courses data
  const cached = getFromCache<Course[]>(cacheKey);
  if (cached) {
    return cached;
  }
  
  const files = fs.readdirSync(coursesDir);
  const courses: Course[] = [];
  
  for (const file of files) {
    if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      const filePath = path.join(coursesDir, file);
      const course = loadYamlFile<Course>(filePath);
      courses.push(course);
    }
  }
  
  const sortedCourses = courses.sort((a, b) => b.year - a.year);
  setCache(cacheKey, sortedCourses);
  
  return sortedCourses;
}

export async function loadCourse(id: string): Promise<Course | null> {
  const courses = await loadCourses();
  return courses.find(course => course.id === id) || null;
}

export async function loadLearningPaths(): Promise<LearningPath[]> {
  const filePath = path.join(dataDir, 'learning_paths.yaml');
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const paths = loadYamlFile<LearningPath[]>(filePath);
  return paths || [];
}

export async function loadResources(): Promise<Resource[]> {
  const resourcesDir = path.join(dataDir, 'resources');
  
  if (!fs.existsSync(resourcesDir)) {
    return [];
  }
  
  const cacheKey = `resources:${resourcesDir}`;
  const cached = getFromCache<Resource[]>(cacheKey);
  if (cached) {
    return cached;
  }
  
  const files = fs.readdirSync(resourcesDir);
  const resources: Resource[] = [];
  
  for (const file of files) {
    if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      const filePath = path.join(resourcesDir, file);
      const resource = loadYamlFile<Resource>(filePath);
      resources.push(resource);
    }
  }
  
  setCache(cacheKey, resources);
  return resources;
}

// Utility function to get all course IDs for static generation
export async function getAllCourseIds(): Promise<string[]> {
  const courses = await loadCourses();
  return courses.map(course => course.id);
}

// Utility function to get all domain names for static generation
export async function getAllDomains(): Promise<string[]> {
  const courses = await loadCourses();
  const domains = new Set<string>();
  
  courses.forEach(course => {
    course.tags?.forEach(tag => {
      // Extract domain-related tags
      if (tag.includes('urban') || tag.includes('environmental') || 
          tag.includes('transportation') || tag.includes('social') ||
          tag.includes('economic') || tag.includes('spatial')) {
        domains.add(tag);
      }
    });
  });
  
  return Array.from(domains);
}
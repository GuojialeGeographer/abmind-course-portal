import * as yaml from 'js-yaml';
import { z } from 'zod';
import {
  CourseSchema,
  LearningPathSchema,
  ResourceSchema,
  SiteConfigSchema,
  CoursesCollectionSchema,
  LearningPathsCollectionSchema,
  ResourcesCollectionSchema,
  type CourseData,
  type LearningPathData,
  type ResourceData,
  type SiteConfigData,
} from './schemas';

// Error types for better error handling
export class YAMLParseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'YAMLParseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public validationErrors: z.ZodError) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Generic YAML parsing function
export function parseYAML(content: string): unknown {
  try {
    return yaml.load(content);
  } catch (error) {
    throw new YAMLParseError(
      `Failed to parse YAML: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
}

// Generic validation function
export function validateData<T>(data: unknown, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        `Validation failed: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        error
      );
    }
    throw error;
  }
}

// Specific parsing and validation functions
export function parseCourse(yamlContent: string): CourseData {
  const data = parseYAML(yamlContent);
  return validateData(data, CourseSchema);
}

export function parseCourses(yamlContent: string): CourseData[] {
  const data = parseYAML(yamlContent);
  return validateData(data, CoursesCollectionSchema);
}

export function parseLearningPath(yamlContent: string): LearningPathData {
  const data = parseYAML(yamlContent);
  return validateData(data, LearningPathSchema);
}

export function parseLearningPaths(yamlContent: string): LearningPathData[] {
  const data = parseYAML(yamlContent);
  return validateData(data, LearningPathsCollectionSchema);
}

export function parseResource(yamlContent: string): ResourceData {
  const data = parseYAML(yamlContent);
  return validateData(data, ResourceSchema);
}

export function parseResources(yamlContent: string): ResourceData[] {
  const data = parseYAML(yamlContent);
  return validateData(data, ResourcesCollectionSchema);
}

export function parseSiteConfig(yamlContent: string): SiteConfigData {
  const data = parseYAML(yamlContent);
  return validateData(data, SiteConfigSchema);
}

// Utility function to format validation errors for user-friendly display
export function formatValidationError(error: ValidationError): string {
  const zodError = error.validationErrors;
  const errors = zodError.issues?.map(e => {
    const path = e.path.length > 0 ? `${e.path.join('.')}` : 'root';
    return `• ${path}: ${e.message}`;
  }) || [];
  
  return `Validation failed:\n${errors.join('\n')}`;
}

// Utility function to check if a string is valid YAML
export function isValidYAML(content: string): boolean {
  try {
    parseYAML(content);
    return true;
  } catch {
    return false;
  }
}

// Utility function to safely parse YAML with error handling
export function safeParseYAML<T>(
  content: string,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = parseYAML(content);
    const validated = validateData(parsed, schema);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: formatValidationError(error) };
    }
    if (error instanceof YAMLParseError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
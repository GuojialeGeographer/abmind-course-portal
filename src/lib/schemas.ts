import { z } from 'zod';

// Base schemas for common types
export const LanguageSchema = z.enum(['zh', 'en']);
export const DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const CourseTypeSchema = z.enum(['course', 'workshop', 'reading_group']);
export const ResourceTypeSchema = z.enum(['docs', 'tutorial', 'paper', 'book', 'dataset', 'tool']);
export const ReferenceTypeSchema = z.enum(['paper', 'book', 'tutorial', 'docs']);
export const AnnouncementTypeSchema = z.enum(['info', 'warning', 'success']);
export const LearningStepTypeSchema = z.enum(['course', 'resource', 'practice']);

// Reference schema
export const ReferenceSchema = z.object({
  title: z.string().min(1, 'Reference title is required'),
  url: z.string().url('Reference URL must be valid'),
  type: ReferenceTypeSchema.optional(),
});

// Session materials schema
export const SessionMaterialsSchema = z.object({
  slides: z.string().url('Slides URL must be valid').optional(),
  code_repo: z.string().url('Code repository URL must be valid').optional(),
  recording: z.string().url('Recording URL must be valid').optional(),
  references: z.array(ReferenceSchema).default([]),
});

// Session schema
export const SessionSchema = z.object({
  id: z.string().min(1, 'Session ID is required'),
  title: z.string().min(1, 'Session title is required'),
  objectives: z.array(z.string().min(1, 'Objective cannot be empty')).min(1, 'At least one objective is required'),
  materials: SessionMaterialsSchema,
});

// External links schema
export const ExternalLinksSchema = z.object({
  course_page: z.string().url('Course page URL must be valid').optional(),
  materials_repo: z.string().url('Materials repository URL must be valid').optional(),
});

// Course schema
export const CourseSchema = z.object({
  id: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Course title is required'),
  type: CourseTypeSchema,
  year: z.number().int().min(2000).max(new Date().getFullYear() + 5, 'Year cannot be too far in the future'),
  difficulty: DifficultySchema,
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'At least one tag is required'),
  instructors: z.array(z.string().min(1, 'Instructor name cannot be empty')).min(1, 'At least one instructor is required'),
  language: LanguageSchema,
  summary: z.string().min(10, 'Summary must be at least 10 characters long'),
  sessions: z.array(SessionSchema).min(1, 'At least one session is required'),
  external_links: ExternalLinksSchema,
  last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Learning step schema
export const LearningStepSchema = z.object({
  order: z.number().int().positive('Order must be a positive integer'),
  type: LearningStepTypeSchema,
  course_id: z.string().min(1, 'Course ID cannot be empty').optional(),
  resource_id: z.string().min(1, 'Resource ID cannot be empty').optional(),
  note: z.string().min(1, 'Note is required'),
  optional: z.boolean().default(false),
}).refine(
  (data) => {
    // Ensure that course_id is provided when type is 'course'
    if (data.type === 'course') {
      return data.course_id !== undefined;
    }
    // Ensure that resource_id is provided when type is 'resource'
    if (data.type === 'resource') {
      return data.resource_id !== undefined;
    }
    return true;
  },
  {
    message: 'course_id is required when type is "course", resource_id is required when type is "resource"',
  }
);

// Learning path schema
export const LearningPathSchema = z.object({
  id: z.string().min(1, 'Learning path ID is required'),
  title: z.string().min(1, 'Learning path title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  recommended_audience: z.string().min(1, 'Recommended audience is required'),
  estimated_duration: z.string().min(1, 'Estimated duration is required'),
  steps: z.array(LearningStepSchema).min(1, 'At least one step is required'),
});

// Resource schema
export const ResourceSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  title: z.string().min(1, 'Resource title is required'),
  type: ResourceTypeSchema,
  url: z.string().url('Resource URL must be valid'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'At least one tag is required'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  language: LanguageSchema,
  difficulty: DifficultySchema.optional(),
});

// Social link schema
export const SocialLinkSchema = z.object({
  name: z.string().min(1, 'Social link name is required'),
  url: z.string().url('Social link URL must be valid'),
  icon: z.string().min(1, 'Social link icon is required'),
});

// Navigation item schema
export const NavigationItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    label: z.string().min(1, 'Navigation label is required'),
    href: z.string().min(1, 'Navigation href is required'),
    active: z.boolean().optional(),
    children: z.array(NavigationItemSchema).optional(),
  })
);

// Announcement schema
export const AnnouncementSchema = z.object({
  title: z.string().min(1, 'Announcement title is required'),
  content: z.string().min(1, 'Announcement content is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: AnnouncementTypeSchema,
});

// Site config schema
export const SiteConfigSchema = z.object({
  site_info: z.object({
    title: z.string().min(1, 'Site title is required'),
    description: z.string().min(10, 'Site description must be at least 10 characters long'),
    url: z.string().url('Site URL must be valid'),
    social_links: z.array(SocialLinkSchema).default([]),
  }),
  navigation: z.array(NavigationItemSchema).min(1, 'At least one navigation item is required'),
  featured_courses: z.array(z.string().min(1, 'Featured course ID cannot be empty')).default([]),
  announcements: z.array(AnnouncementSchema).default([]),
});

// Collection schemas for YAML files
export const CoursesCollectionSchema = z.array(CourseSchema);
export const LearningPathsCollectionSchema = z.array(LearningPathSchema);
export const ResourcesCollectionSchema = z.array(ResourceSchema);

// Export types inferred from schemas
export type CourseData = z.infer<typeof CourseSchema>;
export type LearningPathData = z.infer<typeof LearningPathSchema>;
export type ResourceData = z.infer<typeof ResourceSchema>;
export type SiteConfigData = z.infer<typeof SiteConfigSchema>;
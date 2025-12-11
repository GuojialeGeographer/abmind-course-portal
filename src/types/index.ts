// Core data types for ABMind Course Portal

export interface Course {
  id: string;
  title: string;
  type: 'course' | 'workshop' | 'reading_group';
  year: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  instructors: string[];
  language: 'zh' | 'en';
  summary: string;
  sessions: Session[];
  external_links: ExternalLinks;
  last_updated: string;
}

export interface Session {
  id: string;
  title: string;
  objectives: string[];
  materials: SessionMaterials;
}

export interface SessionMaterials {
  slides?: string;
  code_repo?: string;
  recording?: string;
  references: Reference[];
}

export interface Reference {
  title: string;
  url: string;
  type?: 'paper' | 'book' | 'tutorial' | 'docs';
}

export interface ExternalLinks {
  course_page?: string;
  materials_repo?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  recommended_audience: string;
  estimated_duration: string;
  steps: LearningStep[];
}

export interface LearningStep {
  order: number;
  type: 'course' | 'resource' | 'practice';
  course_id?: string;
  resource_id?: string;
  note: string;
  optional?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'docs' | 'tutorial' | 'paper' | 'book' | 'dataset' | 'tool';
  url: string;
  tags: string[];
  description: string;
  language: 'zh' | 'en';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SiteConfig {
  site_info: {
    title: string;
    description: string;
    url: string;
    social_links: SocialLink[];
  };
  navigation: NavigationItem[];
  featured_courses: string[];
  announcements: Announcement[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavigationItem[];
}

export interface Announcement {
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

// Domain types
export type Domain = 'urban' | 'environmental' | 'transportation' | 'social' | 'economics' | 'computational';

export interface DomainInfo {
  id: Domain;
  label: string;
  description: string;
  tools: string[];
  methodologies: string[];
  keywords: string[];
}

// Filter and search types
export interface FilterState {
  difficulty: string[];
  tags: string[];
  year: string[];
  domains: string[];
  searchQuery: string;
}

// Component prop types
export interface CourseCardProps {
  course: Course;
  showTags?: boolean;
  compact?: boolean;
}

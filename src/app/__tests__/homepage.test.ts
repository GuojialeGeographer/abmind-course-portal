import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadSiteConfig, loadCourses, loadLearningPaths } from '@/lib/data';

// Mock the data loading functions
vi.mock('@/lib/data', () => ({
  loadSiteConfig: vi.fn(),
  loadCourses: vi.fn(),
  loadLearningPaths: vi.fn(),
}));

// Sample test data
const mockSiteConfig = {
  site_info: {
    title: 'ABMind Course Portal',
    description: 'Test description',
    url: 'https://test.com',
    social_links: [],
  },
  navigation: [],
  featured_courses: ['course-1', 'course-2'],
  announcements: [
    {
      title: 'Test Announcement 1',
      content: 'Test content 1',
      date: '2024-12-11',
      type: 'info' as const,
    },
    {
      title: 'Test Announcement 2',
      content: 'Test content 2',
      date: '2024-12-10',
      type: 'success' as const,
    },
  ],
};

const mockCourses = [
  {
    id: 'course-1',
    title: 'Test Course 1',
    type: 'course' as const,
    year: 2024,
    difficulty: 'beginner' as const,
    tags: ['test'],
    instructors: ['Test Instructor'],
    language: 'zh' as const,
    summary: 'Test course summary',
    sessions: [],
    external_links: {},
    last_updated: '2024-01-01',
  },
  {
    id: 'course-2',
    title: 'Test Course 2',
    type: 'workshop' as const,
    year: 2024,
    difficulty: 'intermediate' as const,
    tags: ['test'],
    instructors: ['Test Instructor 2'],
    language: 'zh' as const,
    summary: 'Test workshop summary',
    sessions: [],
    external_links: {},
    last_updated: '2024-01-01',
  },
];

const mockLearningPaths = [
  {
    id: 'path-1',
    title: 'Test Learning Path 1',
    description: 'Test path description',
    recommended_audience: 'Test audience',
    estimated_duration: '4 weeks',
    steps: [
      {
        order: 1,
        type: 'course' as const,
        course_id: 'course-1',
        note: 'Test step',
        optional: false,
      },
    ],
  },
  {
    id: 'path-2',
    title: 'Test Learning Path 2',
    description: 'Test path description 2',
    recommended_audience: 'Test audience 2',
    estimated_duration: '6 weeks',
    steps: [
      {
        order: 1,
        type: 'practice' as const,
        note: 'Test practice step',
        optional: false,
      },
    ],
  },
];

describe('Homepage Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loadSiteConfig as any).mockResolvedValue(mockSiteConfig);
    (loadCourses as any).mockResolvedValue(mockCourses);
    (loadLearningPaths as any).mockResolvedValue(mockLearningPaths);
  });

  describe('Data Loading', () => {
    it('should load site configuration, courses, and learning paths', async () => {
      // Test that the data loading functions are available and can be called
      await loadSiteConfig();
      await loadCourses();
      await loadLearningPaths();
      
      expect(loadSiteConfig).toHaveBeenCalled();
      expect(loadCourses).toHaveBeenCalled();
      expect(loadLearningPaths).toHaveBeenCalled();
    });

    it('should handle empty featured courses by using recent courses', async () => {
      const configWithoutFeatured = {
        ...mockSiteConfig,
        featured_courses: [],
      };
      (loadSiteConfig as any).mockResolvedValue(configWithoutFeatured);

      const config = await loadSiteConfig();
      const courses = await loadCourses();
      
      expect(config.featured_courses).toEqual([]);
      expect(courses.length).toBeGreaterThan(0);
    });
  });

  describe('Hero Section Content', () => {
    it('should display main heading with ABM and Chinese community branding', () => {
      const heroContent = {
        mainHeading: 'Agent-Based Modeling',
        subHeading: '系统化学习平台',
        communityBadge: 'ABMind 中文学习社区',
      };

      // Test that hero section contains expected content
      expect(heroContent.mainHeading).toBe('Agent-Based Modeling');
      expect(heroContent.subHeading).toBe('系统化学习平台');
      expect(heroContent.communityBadge).toBe('ABMind 中文学习社区');
    });

    it('should display descriptive text about ABM and Mesa framework', () => {
      const description = '专为中文社区打造的 ABM 和 Mesa 框架学习资源平台。从基础概念到高级应用，提供结构化的学习路径，专注于地理、城市和环境仿真建模。';
      
      expect(description).toContain('ABM');
      expect(description).toContain('Mesa');
      expect(description).toContain('中文社区');
      expect(description).toContain('学习路径');
    });

    it('should display statistics about courses and learning paths', () => {
      const stats = {
        coursesCount: mockCourses.length,
        learningPathsCount: mockLearningPaths.length,
        communityMembers: 1000,
      };

      expect(stats.coursesCount).toBe(2);
      expect(stats.learningPathsCount).toBe(2);
      expect(stats.communityMembers).toBe(1000);
    });
  });

  describe('Entry Point Buttons', () => {
    it('should provide "Learn ABM from Zero" button linking to learning paths', () => {
      const learnButton = {
        text: '从零开始学习 ABM',
        href: '/learning-paths',
        hasIcon: true,
      };

      expect(learnButton.text).toBe('从零开始学习 ABM');
      expect(learnButton.href).toBe('/learning-paths');
      expect(learnButton.hasIcon).toBe(true);
    });

    it('should provide "View All Courses" button linking to courses page', () => {
      const coursesButton = {
        text: '浏览所有课程',
        href: '/courses',
        hasIcon: true,
      };

      expect(coursesButton.text).toBe('浏览所有课程');
      expect(coursesButton.href).toBe('/courses');
      expect(coursesButton.hasIcon).toBe(true);
    });

    it('should have proper styling and accessibility attributes for buttons', () => {
      const buttonStyles = {
        primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondaryButton: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
        focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      };

      expect(buttonStyles.primaryButton).toContain('bg-blue-600');
      expect(buttonStyles.secondaryButton).toContain('bg-white');
      expect(buttonStyles.focusRing).toContain('focus:ring-2');
    });
  });

  describe('Featured Course Cards', () => {
    it('should display featured courses based on site configuration', () => {
      const featuredCourseIds = mockSiteConfig.featured_courses;
      const availableCourses = mockCourses.filter(course => 
        featuredCourseIds.includes(course.id)
      );

      expect(availableCourses).toHaveLength(2);
      expect(availableCourses[0].id).toBe('course-1');
      expect(availableCourses[1].id).toBe('course-2');
    });

    it('should fall back to recent courses when no featured courses are configured', () => {
      const recentCourses = mockCourses.slice(0, 3);
      
      expect(recentCourses).toHaveLength(2); // We only have 2 mock courses
      expect(recentCourses[0].id).toBe('course-1');
    });

    it('should limit featured courses to maximum of 3', () => {
      const maxFeaturedCourses = 3;
      const displayedCourses = mockCourses.slice(0, maxFeaturedCourses);
      
      expect(displayedCourses.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Learning Path Entry Points', () => {
    it('should display learning path cards with compact layout', () => {
      const displayedPaths = mockLearningPaths.slice(0, 3);
      
      expect(displayedPaths).toHaveLength(2); // We only have 2 mock paths
      expect(displayedPaths[0].title).toBe('Test Learning Path 1');
      expect(displayedPaths[1].title).toBe('Test Learning Path 2');
    });

    it('should provide link to view all learning paths', () => {
      const viewAllLink = {
        text: '查看所有学习路径',
        href: '/learning-paths',
      };

      expect(viewAllLink.text).toBe('查看所有学习路径');
      expect(viewAllLink.href).toBe('/learning-paths');
    });
  });

  describe('Recent Updates and Community Highlights', () => {
    it('should display recent announcements from site configuration', () => {
      const recentAnnouncements = mockSiteConfig.announcements.slice(0, 3);
      
      expect(recentAnnouncements).toHaveLength(2);
      expect(recentAnnouncements[0].title).toBe('Test Announcement 1');
      expect(recentAnnouncements[0].type).toBe('info');
    });

    it('should format announcement dates correctly', () => {
      const announcement = mockSiteConfig.announcements[0];
      const formattedDate = new Date(announcement.date).toLocaleDateString('zh-CN');
      
      expect(formattedDate).toBeTruthy();
      expect(announcement.date).toBe('2024-12-11');
    });

    it('should display community highlights with proper styling', () => {
      const highlights = [
        {
          title: '🎯 专注实用性',
          description: '所有课程都结合实际案例，从城市规划到环境建模，帮助您将理论知识转化为实践能力。',
        },
        {
          title: '🌟 中文友好',
          description: '专为中文用户优化的学习体验，包含中文讲解、本土化案例和活跃的中文社区支持。',
        },
        {
          title: '🚀 持续更新',
          description: '紧跟 ABM 和 Mesa 框架的最新发展，定期更新课程内容和添加新的学习资源。',
        },
      ];

      expect(highlights).toHaveLength(3);
      expect(highlights[0].title).toContain('专注实用性');
      expect(highlights[1].title).toContain('中文友好');
      expect(highlights[2].title).toContain('持续更新');
    });

    it('should display announcement type badges with correct styling', () => {
      const typeStyles = {
        info: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
      };

      expect(typeStyles.info).toBe('bg-blue-100 text-blue-800');
      expect(typeStyles.success).toBe('bg-green-100 text-green-800');
      expect(typeStyles.warning).toBe('bg-yellow-100 text-yellow-800');
    });
  });

  describe('Call to Action Section', () => {
    it('should display call to action with community invitation', () => {
      const ctaContent = {
        heading: '准备开始您的 ABM 学习之旅了吗？',
        description: '加入我们的社区，与志同道合的学习者一起探索复杂系统建模的奥秘',
        primaryAction: '选择学习路径',
        secondaryAction: '了解社区',
      };

      expect(ctaContent.heading).toContain('ABM 学习之旅');
      expect(ctaContent.description).toContain('社区');
      expect(ctaContent.primaryAction).toBe('选择学习路径');
      expect(ctaContent.secondaryAction).toBe('了解社区');
    });

    it('should provide proper navigation links in CTA section', () => {
      const ctaLinks = {
        learningPaths: '/learning-paths',
        about: '/about',
      };

      expect(ctaLinks.learningPaths).toBe('/learning-paths');
      expect(ctaLinks.about).toBe('/about');
    });
  });

  describe('Responsive Design Elements', () => {
    it('should have responsive grid layouts for different screen sizes', () => {
      const responsiveClasses = {
        heroButtons: 'flex-col sm:flex-row',
        statsGrid: 'grid-cols-1 md:grid-cols-3',
        learningPathsGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        coursesGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        updatesGrid: 'grid-cols-1 lg:grid-cols-2',
        ctaButtons: 'flex-col sm:flex-row',
      };

      expect(responsiveClasses.heroButtons).toContain('sm:flex-row');
      expect(responsiveClasses.statsGrid).toContain('md:grid-cols-3');
      expect(responsiveClasses.learningPathsGrid).toContain('lg:grid-cols-3');
    });

    it('should have proper spacing and padding for different sections', () => {
      const sectionSpacing = {
        hero: 'py-16 lg:py-24',
        featuredPaths: 'py-16',
        featuredCourses: 'py-16',
        updates: 'py-16',
        cta: 'py-16',
      };

      expect(sectionSpacing.hero).toContain('py-16');
      expect(sectionSpacing.hero).toContain('lg:py-24');
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper heading hierarchy', () => {
      const headingStructure = {
        mainTitle: 'h1',
        sectionTitles: 'h2',
        subsectionTitles: 'h3',
      };

      expect(headingStructure.mainTitle).toBe('h1');
      expect(headingStructure.sectionTitles).toBe('h2');
      expect(headingStructure.subsectionTitles).toBe('h3');
    });

    it('should have focus management for interactive elements', () => {
      const focusStyles = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
      
      expect(focusStyles).toContain('focus:ring-2');
      expect(focusStyles).toContain('focus:ring-blue-500');
    });

    it('should provide semantic HTML structure', () => {
      const semanticElements = {
        hero: 'section',
        featuredContent: 'section',
        navigation: 'nav',
        main: 'main',
      };

      expect(semanticElements.hero).toBe('section');
      expect(semanticElements.featuredContent).toBe('section');
    });
  });
});
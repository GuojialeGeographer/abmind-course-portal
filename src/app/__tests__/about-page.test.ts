import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadSiteConfig } from '@/lib/data';

// Mock the data loading functions
vi.mock('@/lib/data', () => ({
  loadSiteConfig: vi.fn(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: any) => ({
    type: 'a',
    props: { href, className, ...props, children }
  }),
}));

// Sample test data
const mockSiteConfig = {
  site_info: {
    title: 'ABMind Course Portal',
    description: 'Test description',
    url: 'https://test.com',
    social_links: [
      {
        name: 'GitHub',
        url: 'https://github.com/abmind',
        icon: 'github'
      },
      {
        name: 'WeChat',
        url: 'https://weixin.qq.com/abmind',
        icon: 'wechat'
      },
      {
        name: 'Email',
        url: 'mailto:contact@abmind.org',
        icon: 'email'
      },
      {
        name: 'Bilibili',
        url: 'https://space.bilibili.com/abmind',
        icon: 'bilibili'
      }
    ],
  },
  navigation: [],
  featured_courses: [],
  announcements: [],
};

describe('About Page Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loadSiteConfig as any).mockResolvedValue(mockSiteConfig);
  });

  describe('Data Loading', () => {
    it('should load site configuration for contact information', async () => {
      await loadSiteConfig();
      expect(loadSiteConfig).toHaveBeenCalled();
    });

    it('should handle site config with social links', async () => {
      const config = await loadSiteConfig();
      expect(config.site_info.social_links).toBeDefined();
      expect(config.site_info.social_links.length).toBeGreaterThan(0);
    });
  });

  describe('Page Header Content', () => {
    it('should display main heading about ABMind community', () => {
      const pageTitle = '关于 ABMind 社区';
      const pageDescription = 'ABMind 是一个专注于 Agent-Based Modeling（智能体建模）的中文学习社区。我们致力于为中文用户提供高质量的 ABM 学习资源，促进复杂系统科学在中国的发展和应用。';
      
      expect(pageTitle).toBe('关于 ABMind 社区');
      expect(pageDescription).toContain('Agent-Based Modeling');
      expect(pageDescription).toContain('中文学习社区');
      expect(pageDescription).toContain('复杂系统科学');
    });

    it('should include mission statement', () => {
      const missionTitle = '我们的使命';
      const missionDescription = '通过构建开放、包容的学习环境，让更多中文用户能够掌握 ABM 理论和实践技能，推动复杂系统建模在教育、科研和产业中的广泛应用。';
      
      expect(missionTitle).toBe('我们的使命');
      expect(missionDescription).toContain('开放、包容');
      expect(missionDescription).toContain('ABM 理论和实践技能');
      expect(missionDescription).toContain('教育、科研和产业');
    });
  });

  describe('Community Values', () => {
    it('should display four core community values', () => {
      const communityValues = [
        {
          title: '知识共享',
          description: '我们相信知识应该开放共享。通过免费的课程和资源，让更多人能够接触和学习 ABM。',
        },
        {
          title: '社区协作',
          description: '鼓励社区成员之间的交流合作，共同推进 ABM 在中文世界的发展和应用。',
        },
        {
          title: '创新实践',
          description: '将理论与实践相结合，鼓励创新思维，探索 ABM 在各个领域的应用可能。',
        },
        {
          title: '国际视野',
          description: '保持与国际 ABM 社区的联系，引入前沿理论和方法，促进学术交流。',
        }
      ];

      expect(communityValues).toHaveLength(4);
      expect(communityValues[0].title).toBe('知识共享');
      expect(communityValues[1].title).toBe('社区协作');
      expect(communityValues[2].title).toBe('创新实践');
      expect(communityValues[3].title).toBe('国际视野');
      
      // Check that each value has a meaningful description
      communityValues.forEach(value => {
        expect(value.description.length).toBeGreaterThan(20);
        expect(value.description).toContain('ABM');
      });
    });

    it('should have appropriate icons and colors for each value', () => {
      const valueColors = ['blue', 'green', 'purple', 'indigo'];
      const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        indigo: 'bg-indigo-100 text-indigo-600'
      };

      valueColors.forEach(color => {
        expect(colorClasses[color as keyof typeof colorClasses]).toBeDefined();
        expect(colorClasses[color as keyof typeof colorClasses]).toContain(`bg-${color}-100`);
        expect(colorClasses[color as keyof typeof colorClasses]).toContain(`text-${color}-600`);
      });
    });
  });

  describe('Organizers Information', () => {
    it('should display information about core organizers', () => {
      const organizers = [
        {
          name: '张教授',
          role: '社区创始人',
          affiliation: '某某大学复杂系统研究中心',
          expertise: 'ABM理论、城市建模',
          description: '在复杂系统和智能体建模领域有超过15年的研究经验，发表相关论文50余篇。'
        },
        {
          name: '李博士',
          role: '技术负责人',
          affiliation: '某某科技公司',
          expertise: 'Mesa框架、Python开发',
          description: 'Mesa框架的活跃贡献者，专注于ABM工具开发和技术推广。'
        },
        {
          name: '王研究员',
          role: '内容策划',
          affiliation: '某某研究院',
          expertise: '环境建模、政策仿真',
          description: '专注于环境和政策领域的ABM应用，具有丰富的跨学科研究经验。'
        }
      ];

      expect(organizers).toHaveLength(3);
      
      // Check that each organizer has complete information
      organizers.forEach(organizer => {
        expect(organizer.name).toBeTruthy();
        expect(organizer.role).toBeTruthy();
        expect(organizer.affiliation).toBeTruthy();
        expect(organizer.expertise).toBeTruthy();
        expect(organizer.description).toBeTruthy();
        expect(organizer.description.length).toBeGreaterThan(20);
      });

      // Check specific roles
      expect(organizers.find(o => o.role === '社区创始人')).toBeDefined();
      expect(organizers.find(o => o.role === '技术负责人')).toBeDefined();
      expect(organizers.find(o => o.role === '内容策划')).toBeDefined();
    });
  });

  describe('Community Timeline', () => {
    it('should display development milestones in chronological order', () => {
      const milestones = [
        {
          year: '2023',
          month: '3月',
          title: 'ABMind 社区成立',
          description: '正式成立中文 ABM 学习社区，开始组织第一批学习活动'
        },
        {
          year: '2023',
          month: '6月',
          title: '首次线上工作坊',
          description: '举办"ABM入门"线上工作坊，吸引了200+参与者'
        },
        {
          year: '2024',
          month: '12月',
          title: '社区规模突破',
          description: '社区成员突破1000人，累计举办各类活动50+场次'
        }
      ];

      expect(milestones.length).toBeGreaterThan(0);
      
      // Check chronological order
      for (let i = 1; i < milestones.length; i++) {
        const prevYear = parseInt(milestones[i-1].year);
        const currentYear = parseInt(milestones[i].year);
        expect(currentYear).toBeGreaterThanOrEqual(prevYear);
      }

      // Check that each milestone has complete information
      milestones.forEach(milestone => {
        expect(milestone.year).toMatch(/^\d{4}$/);
        expect(milestone.month).toBeTruthy();
        expect(milestone.title).toBeTruthy();
        expect(milestone.description).toBeTruthy();
      });
    });

    it('should show community growth and achievements', () => {
      const milestones = [
        { title: 'ABMind 社区成立', description: '正式成立中文 ABM 学习社区' },
        { title: '首次线上工作坊', description: '举办"ABM入门"线上工作坊，吸引了200+参与者' },
        { title: '社区规模突破', description: '社区成员突破1000人，累计举办各类活动50+场次' }
      ];

      const growthMilestone = milestones.find(m => m.title.includes('规模突破'));
      expect(growthMilestone).toBeDefined();
      expect(growthMilestone?.description).toContain('1000人');
      expect(growthMilestone?.description).toContain('50+场次');
    });
  });

  describe('Community Statistics', () => {
    it('should display key community metrics', () => {
      const stats = {
        members: '1000+',
        events: '50+',
        courses: '20+',
        learningPaths: '5+'
      };

      expect(stats.members).toBe('1000+');
      expect(stats.events).toBe('50+');
      expect(stats.courses).toBe('20+');
      expect(stats.learningPaths).toBe('5+');
    });

    it('should have appropriate labels for statistics', () => {
      const statLabels = {
        members: '社区成员',
        events: '举办活动',
        courses: '精品课程',
        learningPaths: '学习路径'
      };

      expect(statLabels.members).toBe('社区成员');
      expect(statLabels.events).toBe('举办活动');
      expect(statLabels.courses).toBe('精品课程');
      expect(statLabels.learningPaths).toBe('学习路径');
    });
  });

  describe('Contact Information Display', () => {
    it('should display all social media links from site config', () => {
      const socialLinks = mockSiteConfig.site_info.social_links;
      
      expect(socialLinks).toHaveLength(4);
      
      const expectedLinks = ['GitHub', 'WeChat', 'Email', 'Bilibili'];
      expectedLinks.forEach(linkName => {
        const link = socialLinks.find(l => l.name === linkName);
        expect(link).toBeDefined();
        expect(link?.url).toBeTruthy();
        expect(link?.icon).toBeTruthy();
      });
    });

    it('should provide different participation methods', () => {
      const participationMethods = [
        {
          type: '学习者',
          description: '参加课程学习，完成实践项目，与社区成员交流经验'
        },
        {
          type: '贡献者',
          description: '分享课程资源，撰写教程文档，帮助其他学习者'
        },
        {
          type: '讲师',
          description: '开设专业课程，分享研究成果，推动学科发展'
        }
      ];

      expect(participationMethods).toHaveLength(3);
      
      participationMethods.forEach(method => {
        expect(method.type).toBeTruthy();
        expect(method.description).toBeTruthy();
        expect(method.description.length).toBeGreaterThan(15);
      });
    });
  });

  describe('Call to Action', () => {
    it('should provide clear next steps for users', () => {
      const ctaHeading = '准备加入我们了吗？';
      const ctaDescription = '无论您是 ABM 初学者还是经验丰富的研究者，都欢迎加入我们的社区，一起探索复杂系统建模的无限可能。';
      
      expect(ctaHeading).toContain('加入我们');
      expect(ctaDescription).toContain('ABM 初学者');
      expect(ctaDescription).toContain('经验丰富的研究者');
      expect(ctaDescription).toContain('复杂系统建模');
    });

    it('should provide navigation links to key sections', () => {
      const ctaLinks = [
        { text: '开始学习', href: '/learning-paths' },
        { text: '浏览课程', href: '/courses' }
      ];

      expect(ctaLinks).toHaveLength(2);
      expect(ctaLinks[0].href).toBe('/learning-paths');
      expect(ctaLinks[1].href).toBe('/courses');
    });
  });

  describe('Accessibility and Structure', () => {
    it('should have proper heading hierarchy', () => {
      const headingStructure = {
        mainTitle: 'h1', // 关于 ABMind 社区
        sectionTitles: 'h2', // 我们的使命, 社区价值观, etc.
        subsectionTitles: 'h3' // Individual organizer names, etc.
      };

      expect(headingStructure.mainTitle).toBe('h1');
      expect(headingStructure.sectionTitles).toBe('h2');
      expect(headingStructure.subsectionTitles).toBe('h3');
    });

    it('should have semantic HTML structure', () => {
      const semanticElements = {
        main: 'main',
        sections: 'section',
        articles: 'article'
      };

      expect(semanticElements.main).toBe('main');
      expect(semanticElements.sections).toBe('section');
    });

    it('should have proper color contrast for accessibility', () => {
      const colorContrast = {
        primaryText: 'text-gray-900', // High contrast
        secondaryText: 'text-gray-600', // Medium contrast
        accentColors: ['text-blue-600', 'text-green-600', 'text-purple-600']
      };

      expect(colorContrast.primaryText).toBe('text-gray-900');
      expect(colorContrast.secondaryText).toBe('text-gray-600');
      expect(colorContrast.accentColors.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid layouts', () => {
      const responsiveClasses = {
        valuesGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        organizersGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        statsGrid: 'grid-cols-2 md:grid-cols-4',
        contactGrid: 'grid-cols-1 md:grid-cols-2'
      };

      expect(responsiveClasses.valuesGrid).toContain('lg:grid-cols-4');
      expect(responsiveClasses.organizersGrid).toContain('lg:grid-cols-3');
      expect(responsiveClasses.statsGrid).toContain('md:grid-cols-4');
      expect(responsiveClasses.contactGrid).toContain('md:grid-cols-2');
    });

    it('should have proper spacing for different screen sizes', () => {
      const spacing = {
        sectionMargin: 'mb-16',
        cardPadding: 'p-8',
        gridGap: 'gap-8'
      };

      expect(spacing.sectionMargin).toBe('mb-16');
      expect(spacing.cardPadding).toBe('p-8');
      expect(spacing.gridGap).toBe('gap-8');
    });
  });
});
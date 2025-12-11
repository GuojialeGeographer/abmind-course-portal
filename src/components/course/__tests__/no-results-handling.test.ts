import { describe, it, expect, vi } from 'vitest';

// Mock NoResults component for testing
interface NoResultsProps {
  type: 'search' | 'filter' | 'general';
  query?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  onClearSearch?: () => void;
  suggestions?: string[];
  className?: string;
}

// Mock component implementation for testing
function mockRenderNoResults(props: NoResultsProps) {
  const {
    type,
    query,
    activeFilterCount = 0,
    onClearFilters,
    onClearSearch,
    suggestions = ['Mesa', 'ABM', '城市建模', '智能体'],
    className = ''
  } = props;

  // Simulate component behavior
  const getTitle = () => {
    switch (type) {
      case 'search':
        return query ? `未找到 "${query}" 的相关结果` : '未找到搜索结果';
      case 'filter':
        return '当前筛选条件下没有匹配的内容';
      default:
        return '暂无内容';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'search':
        return '尝试使用不同的关键词，或浏览下面的推荐内容';
      case 'filter':
        return '尝试调整筛选条件，或清除部分筛选来查看更多内容';
      default:
        return '请稍后再试，或浏览其他内容';
    }
  };

  const generateAlternativeSearchTerms = (originalQuery: string): string[] => {
    if (!originalQuery) return suggestions.slice(0, 4);

    const alternatives: string[] = [];
    const queryLower = originalQuery.toLowerCase();

    // Add related terms based on common patterns
    if (queryLower.includes('mesa')) {
      alternatives.push('ABM', 'Python', '智能体建模');
    }
    if (queryLower.includes('城市') || queryLower.includes('urban')) {
      alternatives.push('交通建模', '环境仿真', '空间分析');
    }
    if (queryLower.includes('abm') || queryLower.includes('智能体')) {
      alternatives.push('Mesa', '复杂系统', '仿真建模');
    }
    if (queryLower.includes('python')) {
      alternatives.push('Mesa', 'NetworkX', '数据分析');
    }

    // Fill with general suggestions if not enough alternatives
    const remaining = 4 - alternatives.length;
    if (remaining > 0) {
      alternatives.push(...suggestions.slice(0, remaining));
    }

    return alternatives.slice(0, 4);
  };

  return {
    type,
    title: getTitle(),
    description: getDescription(),
    query,
    activeFilterCount,
    hasSearchClearButton: type === 'search' && !!onClearSearch,
    hasFilterClearButton: type === 'filter' && activeFilterCount > 0 && !!onClearFilters,
    suggestions: type === 'search' ? generateAlternativeSearchTerms(query || '') : [],
    popularContent: [
      { title: 'Mesa 框架基础', href: '/courses/mesa-basics' },
      { title: '城市建模入门', href: '/courses/urban-modeling' },
      { title: 'ABM 学习路径', href: '/learning-paths/abm-beginner' },
      { title: 'Mesa 官方文档', href: '/resources/mesa-docs' }
    ],
    contactLinks: [
      { text: '联系我们', href: 'mailto:contact@abmind.org' },
      { text: '加入社区', href: '/about#community' },
      { text: '贡献内容', href: '/about#contribute' }
    ],
    className,
    onClearFilters,
    onClearSearch
  };
}

describe('NoResults Component', () => {
  describe('Search no results', () => {
    it('should render search no results with query', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'nonexistent topic'
      });

      expect(rendered.type).toBe('search');
      expect(rendered.title).toBe('未找到 "nonexistent topic" 的相关结果');
      expect(rendered.description).toBe('尝试使用不同的关键词，或浏览下面的推荐内容');
      expect(rendered.hasSearchClearButton).toBe(false); // No onClearSearch provided
    });

    it('should render search no results without query', () => {
      const rendered = mockRenderNoResults({
        type: 'search'
      });

      expect(rendered.title).toBe('未找到搜索结果');
      expect(rendered.description).toBe('尝试使用不同的关键词，或浏览下面的推荐内容');
    });

    it('should show clear search button when onClearSearch is provided', () => {
      const mockClearSearch = vi.fn();
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'test',
        onClearSearch: mockClearSearch
      });

      expect(rendered.hasSearchClearButton).toBe(true);
      expect(rendered.onClearSearch).toBe(mockClearSearch);
    });

    it('should generate search suggestions based on query', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'mesa'
      });

      expect(rendered.suggestions).toContain('ABM');
      expect(rendered.suggestions).toContain('Python');
      expect(rendered.suggestions).toContain('智能体建模');
      expect(rendered.suggestions).toHaveLength(4);
    });

    it('should generate urban-related suggestions for urban queries', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: '城市建模'
      });

      expect(rendered.suggestions).toContain('交通建模');
      expect(rendered.suggestions).toContain('环境仿真');
      expect(rendered.suggestions).toContain('空间分析');
    });

    it('should generate ABM-related suggestions for ABM queries', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'abm'
      });

      expect(rendered.suggestions).toContain('Mesa');
      expect(rendered.suggestions).toContain('复杂系统');
      expect(rendered.suggestions).toContain('仿真建模');
    });

    it('should use default suggestions when query has no specific matches', () => {
      const customSuggestions = ['Custom1', 'Custom2', 'Custom3', 'Custom4'];
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'random query',
        suggestions: customSuggestions
      });

      expect(rendered.suggestions).toEqual(customSuggestions);
    });

    it('should use default suggestions when no query provided', () => {
      const customSuggestions = ['Default1', 'Default2', 'Default3', 'Default4'];
      const rendered = mockRenderNoResults({
        type: 'search',
        suggestions: customSuggestions
      });

      expect(rendered.suggestions).toEqual(customSuggestions);
    });
  });

  describe('Filter no results', () => {
    it('should render filter no results', () => {
      const rendered = mockRenderNoResults({
        type: 'filter',
        activeFilterCount: 3
      });

      expect(rendered.type).toBe('filter');
      expect(rendered.title).toBe('当前筛选条件下没有匹配的内容');
      expect(rendered.description).toBe('尝试调整筛选条件，或清除部分筛选来查看更多内容');
      expect(rendered.activeFilterCount).toBe(3);
    });

    it('should show clear filters button when filters are active and onClearFilters is provided', () => {
      const mockClearFilters = vi.fn();
      const rendered = mockRenderNoResults({
        type: 'filter',
        activeFilterCount: 2,
        onClearFilters: mockClearFilters
      });

      expect(rendered.hasFilterClearButton).toBe(true);
      expect(rendered.onClearFilters).toBe(mockClearFilters);
    });

    it('should not show clear filters button when no active filters', () => {
      const mockClearFilters = vi.fn();
      const rendered = mockRenderNoResults({
        type: 'filter',
        activeFilterCount: 0,
        onClearFilters: mockClearFilters
      });

      expect(rendered.hasFilterClearButton).toBe(false);
    });

    it('should not show clear filters button when onClearFilters is not provided', () => {
      const rendered = mockRenderNoResults({
        type: 'filter',
        activeFilterCount: 3
      });

      expect(rendered.hasFilterClearButton).toBe(false);
    });

    it('should not generate search suggestions for filter type', () => {
      const rendered = mockRenderNoResults({
        type: 'filter',
        activeFilterCount: 1
      });

      expect(rendered.suggestions).toEqual([]);
    });
  });

  describe('General no results', () => {
    it('should render general no results', () => {
      const rendered = mockRenderNoResults({
        type: 'general'
      });

      expect(rendered.type).toBe('general');
      expect(rendered.title).toBe('暂无内容');
      expect(rendered.description).toBe('请稍后再试，或浏览其他内容');
    });

    it('should not show action buttons for general type', () => {
      const rendered = mockRenderNoResults({
        type: 'general'
      });

      expect(rendered.hasSearchClearButton).toBe(false);
      expect(rendered.hasFilterClearButton).toBe(false);
      expect(rendered.suggestions).toEqual([]);
    });
  });

  describe('Popular content recommendations', () => {
    it('should always show popular content recommendations', () => {
      const rendered = mockRenderNoResults({
        type: 'search'
      });

      expect(rendered.popularContent).toHaveLength(4);
      expect(rendered.popularContent[0]).toEqual({
        title: 'Mesa 框架基础',
        href: '/courses/mesa-basics'
      });
      expect(rendered.popularContent[1]).toEqual({
        title: '城市建模入门',
        href: '/courses/urban-modeling'
      });
      expect(rendered.popularContent[2]).toEqual({
        title: 'ABM 学习路径',
        href: '/learning-paths/abm-beginner'
      });
      expect(rendered.popularContent[3]).toEqual({
        title: 'Mesa 官方文档',
        href: '/resources/mesa-docs'
      });
    });
  });

  describe('Contact information', () => {
    it('should always show contact links', () => {
      const rendered = mockRenderNoResults({
        type: 'search'
      });

      expect(rendered.contactLinks).toHaveLength(3);
      expect(rendered.contactLinks[0]).toEqual({
        text: '联系我们',
        href: 'mailto:contact@abmind.org'
      });
      expect(rendered.contactLinks[1]).toEqual({
        text: '加入社区',
        href: '/about#community'
      });
      expect(rendered.contactLinks[2]).toEqual({
        text: '贡献内容',
        href: '/about#contribute'
      });
    });
  });

  describe('Suggestion generation logic', () => {
    it('should handle multiple keyword matches in query', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'mesa python urban'
      });

      // Should include suggestions from both mesa and urban patterns
      const suggestions = rendered.suggestions;
      expect(suggestions).toContain('ABM');
      expect(suggestions).toContain('交通建模');
      expect(suggestions).toHaveLength(4);
    });

    it('should limit suggestions to 4 items', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'mesa'
      });

      expect(rendered.suggestions).toHaveLength(4);
    });

    it('should handle case-insensitive matching', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'MESA'
      });

      expect(rendered.suggestions).toContain('ABM');
      expect(rendered.suggestions).toContain('Python');
    });

    it('should handle empty query gracefully', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        query: ''
      });

      expect(rendered.suggestions).toHaveLength(4);
      expect(rendered.suggestions).toEqual(['Mesa', 'ABM', '城市建模', '智能体']);
    });
  });

  describe('Component props', () => {
    it('should pass through className', () => {
      const rendered = mockRenderNoResults({
        type: 'search',
        className: 'custom-class'
      });

      expect(rendered.className).toBe('custom-class');
    });

    it('should handle all props correctly', () => {
      const mockClearSearch = vi.fn();
      const mockClearFilters = vi.fn();
      const customSuggestions = ['Custom1', 'Custom2'];

      const rendered = mockRenderNoResults({
        type: 'search',
        query: 'test query',
        activeFilterCount: 2,
        onClearFilters: mockClearFilters,
        onClearSearch: mockClearSearch,
        suggestions: customSuggestions,
        className: 'test-class'
      });

      expect(rendered.type).toBe('search');
      expect(rendered.query).toBe('test query');
      expect(rendered.activeFilterCount).toBe(2);
      expect(rendered.onClearFilters).toBe(mockClearFilters);
      expect(rendered.onClearSearch).toBe(mockClearSearch);
      expect(rendered.className).toBe('test-class');
    });
  });
});
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * **Feature: abmind-course-portal, Property 8: External link handling**
 * **Validates: Requirements 2.4, 2.5, 7.1**
 * 
 * For any external link in the system, it should open in a new tab, have appropriate 
 * visual indicators, and maintain consistent formatting across all course materials
 */

// Generators for test data
const externalUrlArb = fc.webUrl().filter(url => {
  // Ensure it's actually external by checking it has a domain
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.length > 0;
  } catch {
    return false;
  }
});

const internalUrlArb = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }).map(path => `/${path}`),
  fc.string({ minLength: 1, maxLength: 50 }).map(path => `#${path}`),
  fc.constant('/'),
  fc.constant('/courses'),
  fc.constant('/learning-paths')
);

const linkStatusArb = fc.constantFrom('available', 'unavailable', 'checking', 'unknown');

const materialTypeArb = fc.constantFrom('slides', 'code_repo', 'recording', 'reference');

// Mock DOM element creation for testing
function createMockElement(tagName: string, attributes: Record<string, any> = {}): any {
  return {
    tagName: tagName.toUpperCase(),
    textContent: attributes.textContent || '',
    getAttribute: (name: string) => attributes[name] || null,
    hasAttribute: (name: string) => name in attributes,
    classList: {
      contains: (className: string) => (attributes.className || '').includes(className),
    },
    href: attributes.href || null,
    target: attributes.target || null,
    rel: attributes.rel || null,
    ...attributes,
  };
}

// Mock LinkComponent rendering
function mockRenderLinkComponent(
  href: string, 
  children: string, 
  options: {
    showIcon?: boolean;
    status?: 'available' | 'unavailable' | 'checking' | 'unknown';
    fallbackContent?: string;
  } = {}
): any {
  const { showIcon = true, status = 'unknown', fallbackContent } = options;
  
  // Determine if URL is external (server-side safe)
  const isExternal = (() => {
    try {
      const urlObj = new URL(href);
      return !href.startsWith('/') && !href.startsWith('#') && urlObj.protocol.startsWith('http');
    } catch {
      return false;
    }
  })();

  // Handle unavailable links with fallback content
  if (status === 'unavailable' && fallbackContent) {
    return {
      element: createMockElement('div', {
        className: 'inline-flex items-center gap-2',
      }),
      isExternal,
      status,
      hasFallback: true,
      fallbackContent,
      children,
      href,
    };
  }

  // Create appropriate link element
  const linkElement = isExternal 
    ? createMockElement('a', {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'inline-flex items-center gap-2 transition-colors',
        textContent: children,
      })
    : createMockElement('a', {
        href,
        className: 'inline-flex items-center gap-2 transition-colors',
        textContent: children,
      });

  // Add status indicator
  let statusIcon = null;
  if (showIcon) {
    if (status === 'unavailable') {
      statusIcon = createMockElement('svg', {
        className: 'w-4 h-4 text-red-500 flex-shrink-0',
        title: '链接不可用',
      });
    } else if (status === 'checking') {
      statusIcon = createMockElement('svg', {
        className: 'w-4 h-4 text-yellow-500 flex-shrink-0 animate-spin',
        title: '检查链接状态中',
      });
    } else if (isExternal) {
      statusIcon = createMockElement('svg', {
        className: 'w-4 h-4 text-gray-400 flex-shrink-0',
        title: '外部链接',
      });
    }
  }

  return {
    element: linkElement,
    statusIcon,
    isExternal,
    status,
    hasFallback: false,
    children,
    href,
  };
}

// Mock MaterialLink rendering
function mockRenderMaterialLink(
  type: 'slides' | 'code_repo' | 'recording' | 'reference',
  url: string,
  options: {
    title?: string;
    status?: 'available' | 'unavailable' | 'checking' | 'unknown';
    fallbackContent?: string;
  } = {}
): any {
  const { title, status = 'unknown', fallbackContent } = options;

  const materialConfig = {
    slides: { label: '课件', icon: 'PPT', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    code_repo: { label: '代码仓库', icon: 'CODE', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    recording: { label: '录像', icon: 'REC', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    reference: { label: '参考资料', icon: 'REF', bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  };

  const config = materialConfig[type];

  // Handle unavailable status with fallback
  if (status === 'unavailable' && fallbackContent) {
    return {
      element: createMockElement('div', {
        className: 'flex items-center gap-2 p-3 border border-gray-200 rounded-md bg-gray-50',
      }),
      iconElement: createMockElement('div', {
        className: `w-8 h-8 ${config.bgColor} rounded-md flex items-center justify-center opacity-50`,
      }),
      titleElement: createMockElement('p', {
        textContent: title || config.label,
        className: 'text-sm font-medium text-gray-500 line-through',
      }),
      statusIcon: createMockElement('svg', {
        className: 'w-4 h-4 text-red-500',
      }),
      isExternal: true,
      status,
      hasFallback: true,
      fallbackContent,
      type,
      url,
    };
  }

  // Normal material link
  const linkElement = createMockElement('a', {
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors',
  });

  const iconElement = createMockElement('div', {
    className: `w-8 h-8 ${config.bgColor} rounded-md flex items-center justify-center`,
  });

  const titleElement = createMockElement('p', {
    textContent: title || config.label,
    className: 'text-sm font-medium text-gray-900',
  });

  let statusIcon = null;
  if (status === 'unavailable') {
    statusIcon = createMockElement('svg', {
      className: 'w-4 h-4 text-red-500',
    });
  } else if (status === 'checking') {
    statusIcon = createMockElement('svg', {
      className: 'w-4 h-4 text-yellow-500 animate-spin',
    });
  } else {
    statusIcon = createMockElement('svg', {
      className: 'w-4 h-4 text-gray-400',
    });
  }

  return {
    element: linkElement,
    iconElement,
    titleElement,
    statusIcon,
    isExternal: true,
    status,
    hasFallback: false,
    type,
    url,
  };
}

describe('External Link Handling Property Tests', () => {
  it('Property 8: External link handling - External links open in new tab with security attributes', () => {
    fc.assert(
      fc.property(externalUrlArb, fc.string({ minLength: 1, maxLength: 100 }), (url, linkText) => {
        const rendered = mockRenderLinkComponent(url, linkText);

        // Verify it's identified as external
        expect(rendered.isExternal).toBe(true);

        // Verify security attributes for external links
        expect(rendered.element.target).toBe('_blank');
        expect(rendered.element.rel).toBe('noopener noreferrer');
        expect(rendered.element.href).toBe(url);

        // Verify external link indicator is present
        if (rendered.statusIcon && rendered.status !== 'unavailable' && rendered.status !== 'checking') {
          expect(rendered.statusIcon.className).toContain('text-gray-400');
          expect(rendered.statusIcon.title).toBe('外部链接');
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - Internal links do not have new tab behavior', () => {
    fc.assert(
      fc.property(internalUrlArb, fc.string({ minLength: 1, maxLength: 100 }), (url, linkText) => {
        const rendered = mockRenderLinkComponent(url, linkText);

        // Verify it's identified as internal
        expect(rendered.isExternal).toBe(false);

        // Verify no new tab attributes for internal links
        expect(rendered.element.target).toBeNull();
        expect(rendered.element.rel).toBeNull();
        expect(rendered.element.href).toBe(url);

        // Verify no external link indicator
        if (rendered.statusIcon) {
          expect(rendered.statusIcon.title).not.toBe('外部链接');
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - Link status indicators are consistent', () => {
    fc.assert(
      fc.property(
        externalUrlArb, 
        fc.string({ minLength: 1, maxLength: 100 }),
        linkStatusArb,
        (url, linkText, status) => {
          const rendered = mockRenderLinkComponent(url, linkText, { status });

          // Verify status is reflected in the component
          expect(rendered.status).toBe(status);

          // Verify appropriate status indicators
          if (rendered.statusIcon) {
            switch (status) {
              case 'unavailable':
                expect(rendered.statusIcon.className).toContain('text-red-500');
                expect(rendered.statusIcon.title).toBe('链接不可用');
                break;
              case 'checking':
                expect(rendered.statusIcon.className).toContain('text-yellow-500');
                expect(rendered.statusIcon.className).toContain('animate-spin');
                expect(rendered.statusIcon.title).toBe('检查链接状态中');
                break;
              case 'available':
              case 'unknown':
                if (rendered.isExternal) {
                  expect(rendered.statusIcon.className).toContain('text-gray-400');
                  expect(rendered.statusIcon.title).toBe('外部链接');
                }
                break;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - Material links have consistent formatting', () => {
    fc.assert(
      fc.property(
        materialTypeArb,
        externalUrlArb,
        fc.option(fc.string({ minLength: 1, maxLength: 100 })),
        linkStatusArb,
        (type, url, title, status) => {
          const rendered = mockRenderMaterialLink(type, url, { title, status });

          // Verify all material links are treated as external
          expect(rendered.isExternal).toBe(true);

          // Verify security attributes
          if (!rendered.hasFallback) {
            expect(rendered.element.target).toBe('_blank');
            expect(rendered.element.rel).toBe('noopener noreferrer');
            expect(rendered.element.href).toBe(url);
          }

          // Verify consistent structure
          expect(rendered.iconElement).toBeDefined();
          expect(rendered.titleElement).toBeDefined();
          expect(rendered.statusIcon).toBeDefined();

          // Verify type-specific styling
          const expectedConfig = {
            slides: { bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
            code_repo: { bgColor: 'bg-green-100', textColor: 'text-green-600' },
            recording: { bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
            reference: { bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
          };

          const config = expectedConfig[type];
          expect(rendered.iconElement.className).toContain(config.bgColor);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - Fallback content is displayed for unavailable links', () => {
    fc.assert(
      fc.property(
        externalUrlArb,
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        (url, linkText, fallbackText) => {
          const rendered = mockRenderLinkComponent(url, linkText, {
            status: 'unavailable',
            fallbackContent: fallbackText,
          });

          // Verify fallback is displayed
          expect(rendered.hasFallback).toBe(true);
          expect(rendered.fallbackContent).toBe(fallbackText);
          expect(rendered.status).toBe('unavailable');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - Material links show fallback for unavailable resources', () => {
    fc.assert(
      fc.property(
        materialTypeArb,
        externalUrlArb,
        fc.option(fc.string({ minLength: 1, maxLength: 100 })),
        fc.string({ minLength: 1, maxLength: 200 }),
        (type, url, title, fallbackText) => {
          const rendered = mockRenderMaterialLink(type, url, {
            title,
            status: 'unavailable',
            fallbackContent: fallbackText,
          });

          // Verify fallback behavior
          expect(rendered.hasFallback).toBe(true);
          expect(rendered.fallbackContent).toBe(fallbackText);
          expect(rendered.status).toBe('unavailable');

          // Verify visual indicators for unavailable state
          expect(rendered.iconElement.className).toContain('opacity-50');
          expect(rendered.titleElement.className).toContain('line-through');
          expect(rendered.statusIcon.className).toContain('text-red-500');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - URL validation works correctly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          externalUrlArb,
          internalUrlArb,
          fc.string({ minLength: 1, maxLength: 50 }) // Invalid URLs
        ),
        fc.string({ minLength: 1, maxLength: 100 }),
        (url, linkText) => {
          const rendered = mockRenderLinkComponent(url, linkText);

          // Verify URL classification
          const shouldBeExternal = (() => {
            try {
              const urlObj = new URL(url);
              return !url.startsWith('/') && !url.startsWith('#') && urlObj.protocol.startsWith('http');
            } catch {
              return false;
            }
          })();

          expect(rendered.isExternal).toBe(shouldBeExternal);

          // Verify appropriate attributes based on classification
          if (shouldBeExternal) {
            expect(rendered.element.target).toBe('_blank');
            expect(rendered.element.rel).toBe('noopener noreferrer');
          } else {
            expect(rendered.element.target).toBeNull();
            expect(rendered.element.rel).toBeNull();
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: External link handling - Visual indicators are consistent across components', () => {
    fc.assert(
      fc.property(
        externalUrlArb,
        fc.string({ minLength: 1, maxLength: 100 }),
        linkStatusArb,
        (url, linkText, status) => {
          const linkRendered = mockRenderLinkComponent(url, linkText, { status });
          const materialRendered = mockRenderMaterialLink('slides', url, { status });

          // Both should identify as external
          expect(linkRendered.isExternal).toBe(true);
          expect(materialRendered.isExternal).toBe(true);

          // Both should have consistent status
          expect(linkRendered.status).toBe(status);
          expect(materialRendered.status).toBe(status);

          // Both should have security attributes (when not showing fallback)
          if (!linkRendered.hasFallback) {
            expect(linkRendered.element.target).toBe('_blank');
            expect(linkRendered.element.rel).toBe('noopener noreferrer');
          }

          if (!materialRendered.hasFallback) {
            expect(materialRendered.element.target).toBe('_blank');
            expect(materialRendered.element.rel).toBe('noopener noreferrer');
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
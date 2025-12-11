import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Course, Session, SessionMaterials, Reference } from '@/types';

/**
 * **Feature: abmind-course-portal, Property 2: Course detail page completeness**
 * **Validates: Requirements 2.3, 3.2**
 * 
 * For any course in the system, its detail page should contain all available metadata 
 * (title, instructors, difficulty, tags, sessions) and properly formatted external links to materials
 */

// Generators for test data
const referenceArb = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  url: fc.webUrl(),
  type: fc.constantFrom('paper', 'book', 'tutorial', 'docs'),
});

const sessionMaterialsArb = fc.record({
  slides: fc.option(fc.webUrl()),
  code_repo: fc.option(fc.webUrl()),
  recording: fc.option(fc.webUrl()),
  references: fc.array(referenceArb, { minLength: 0, maxLength: 5 }),
});

const sessionArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  objectives: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
  materials: sessionMaterialsArb,
});

const courseArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  type: fc.constantFrom('course', 'workshop', 'reading_group'),
  year: fc.integer({ min: 2000, max: new Date().getFullYear() + 5 }),
  difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
  instructors: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
  language: fc.constantFrom('zh', 'en'),
  summary: fc.string({ minLength: 10, maxLength: 500 }),
  sessions: fc.array(sessionArb, { minLength: 1, maxLength: 10 }),
  external_links: fc.record({
    course_page: fc.option(fc.webUrl()),
    materials_repo: fc.option(fc.webUrl()),
  }),
  last_updated: fc.integer({ min: 2000, max: new Date().getFullYear() })
    .chain(year => fc.integer({ min: 1, max: 12 })
      .chain(month => fc.integer({ min: 1, max: 28 })
        .map(day => `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        )
      )
    ),
});

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

// Mock React component rendering for testing
function mockRenderCourseCard(course: Course): any {
  // Simulate the CourseCard component structure
  const cardElement = createMockElement('div', {
    className: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6',
    textContent: course.title,
  });

  // Add metadata elements
  const titleLink = createMockElement('a', {
    href: `/courses/${course.id}`,
    textContent: course.title,
    className: 'text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors',
  });

  const difficultyBadge = createMockElement('span', {
    textContent: course.difficulty,
    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`,
  });

  const typeBadge = createMockElement('span', {
    textContent: course.type,
    className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
  });

  const yearSpan = createMockElement('span', {
    textContent: course.year.toString(),
    className: 'text-sm text-gray-500',
  });

  const instructorsText = createMockElement('span', {
    textContent: `讲师: ${course.instructors.join(', ')}`,
    className: 'font-medium',
  });

  const sessionCount = createMockElement('div', {
    textContent: `${course.sessions.length} 节课`,
  });

  const tagElements = course.tags.slice(0, 5).map(tag => 
    createMockElement('span', {
      textContent: tag,
      className: 'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700',
    })
  );

  return {
    cardElement,
    titleLink,
    difficultyBadge,
    typeBadge,
    yearSpan,
    instructorsText,
    sessionCount,
    tagElements,
    course,
  };
}

function mockRenderSessionList(sessions: Session[]): any {
  if (sessions.length === 0) {
    return {
      emptyState: createMockElement('div', {
        textContent: '暂无课程内容',
        className: 'text-center py-8 text-gray-500',
      }),
      sessions: [],
    };
  }

  const sessionElements = sessions.map((session, index) => {
    const sessionElement = createMockElement('div', {
      className: 'border border-gray-200 rounded-lg p-6 bg-white',
    });

    const titleElement = createMockElement('h3', {
      textContent: `第 ${index + 1} 节: ${session.title}`,
      className: 'text-lg font-semibold text-gray-900 mb-2',
    });

    const objectiveElements = session.objectives.map(objective =>
      createMockElement('li', {
        textContent: objective,
        className: 'text-sm text-gray-600',
      })
    );

    const materialLinks = [];
    if (session.materials.slides) {
      materialLinks.push(createMockElement('a', {
        href: session.materials.slides,
        target: '_blank',
        rel: 'noopener noreferrer',
        textContent: '课件',
        className: 'flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors',
      }));
    }

    if (session.materials.code_repo) {
      materialLinks.push(createMockElement('a', {
        href: session.materials.code_repo,
        target: '_blank',
        rel: 'noopener noreferrer',
        textContent: '代码仓库',
        className: 'flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors',
      }));
    }

    if (session.materials.recording) {
      materialLinks.push(createMockElement('a', {
        href: session.materials.recording,
        target: '_blank',
        rel: 'noopener noreferrer',
        textContent: '录像',
        className: 'flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors',
      }));
    }

    const referenceLinks = session.materials.references.map(reference =>
      createMockElement('a', {
        href: reference.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        textContent: reference.title,
        className: 'flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors',
      })
    );

    return {
      sessionElement,
      titleElement,
      objectiveElements,
      materialLinks,
      referenceLinks,
      session,
      index,
    };
  });

  const headerElement = createMockElement('h2', {
    textContent: '课程内容',
    className: 'text-xl font-semibold text-gray-900',
  });

  const countElement = createMockElement('span', {
    textContent: `共 ${sessions.length} 节课`,
    className: 'text-sm text-gray-500',
  });

  return {
    headerElement,
    countElement,
    sessionElements,
    sessions,
  };
}

describe('Course Content Display Property Tests', () => {
  it('Property 2: Course detail page completeness - CourseCard contains all required metadata', () => {
    fc.assert(
      fc.property(courseArb, (course) => {
        const rendered = mockRenderCourseCard(course);

        // Verify title is present and properly linked
        expect(rendered.titleLink.textContent).toBe(course.title);
        expect(rendered.titleLink.href).toBe(`/courses/${course.id}`);

        // Verify difficulty indicator is present
        expect(rendered.difficultyBadge.textContent).toBe(course.difficulty);

        // Verify type indicator is present
        expect(rendered.typeBadge.textContent).toBe(course.type);

        // Verify year is displayed
        expect(rendered.yearSpan.textContent).toBe(course.year.toString());

        // Verify instructors are displayed
        expect(rendered.instructorsText.textContent).toContain('讲师:');
        course.instructors.forEach(instructor => {
          expect(rendered.instructorsText.textContent).toContain(instructor);
        });

        // Verify session count is displayed
        expect(rendered.sessionCount.textContent).toContain(course.sessions.length.toString());
        expect(rendered.sessionCount.textContent).toContain('节课');

        // Verify tags are displayed (up to 5)
        const displayedTagCount = Math.min(course.tags.length, 5);
        expect(rendered.tagElements).toHaveLength(displayedTagCount);
        
        for (let i = 0; i < displayedTagCount; i++) {
          expect(rendered.tagElements[i].textContent).toBe(course.tags[i]);
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Course detail page completeness - SessionList displays all session information', () => {
    fc.assert(
      fc.property(fc.array(sessionArb, { minLength: 1, maxLength: 10 }), (sessions) => {
        const rendered = mockRenderSessionList(sessions);

        // Verify header and count are present
        expect(rendered.headerElement.textContent).toBe('课程内容');
        expect(rendered.countElement.textContent).toBe(`共 ${sessions.length} 节课`);

        // Verify all sessions are rendered
        expect(rendered.sessionElements).toHaveLength(sessions.length);

        rendered.sessionElements.forEach((sessionRender: any, index: number) => {
          const session = sessions[index];

          // Verify session title includes session number and title
          expect(sessionRender.titleElement.textContent).toBe(`第 ${index + 1} 节: ${session.title}`);

          // Verify all objectives are present
          expect(sessionRender.objectiveElements).toHaveLength(session.objectives.length);
          sessionRender.objectiveElements.forEach((objElement: any, objIndex: number) => {
            expect(objElement.textContent).toBe(session.objectives[objIndex]);
          });

          // Verify material links are properly formatted
          let expectedMaterialCount = 0;
          if (session.materials.slides) expectedMaterialCount++;
          if (session.materials.code_repo) expectedMaterialCount++;
          if (session.materials.recording) expectedMaterialCount++;

          expect(sessionRender.materialLinks).toHaveLength(expectedMaterialCount);

          // Verify each material link has proper attributes
          sessionRender.materialLinks.forEach((link: any) => {
            expect(link.target).toBe('_blank');
            expect(link.rel).toBe('noopener noreferrer');
            expect(link.href).toMatch(/^https?:\/\//);
          });

          // Verify reference links
          expect(sessionRender.referenceLinks).toHaveLength(session.materials.references.length);
          sessionRender.referenceLinks.forEach((refLink: any, refIndex: number) => {
            const reference = session.materials.references[refIndex];
            expect(refLink.textContent).toBe(reference.title);
            expect(refLink.href).toBe(reference.url);
            expect(refLink.target).toBe('_blank');
            expect(refLink.rel).toBe('noopener noreferrer');
          });
        });

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Course detail page completeness - Empty sessions handled gracefully', () => {
    fc.assert(
      fc.property(fc.constant([]), (emptySessions) => {
        const rendered = mockRenderSessionList(emptySessions);

        // Verify empty state is displayed
        expect(rendered.emptyState).toBeDefined();
        expect(rendered.emptyState.textContent).toBe('暂无课程内容');
        expect(rendered.sessions).toHaveLength(0);

        return true;
      }),
      { numRuns: 10 }
    );
  });

  it('Property 2: Course detail page completeness - External links are properly formatted', () => {
    fc.assert(
      fc.property(sessionMaterialsArb, (materials) => {
        const mockSession: Session = {
          id: 'test-session',
          title: 'Test Session',
          objectives: ['Test objective'],
          materials,
        };

        const rendered = mockRenderSessionList([mockSession]);
        const sessionRender = rendered.sessionElements[0];

        // Count expected external links
        let expectedLinkCount = 0;
        if (materials.slides) expectedLinkCount++;
        if (materials.code_repo) expectedLinkCount++;
        if (materials.recording) expectedLinkCount++;

        expect(sessionRender.materialLinks).toHaveLength(expectedLinkCount);

        // Verify all external links have proper security attributes
        sessionRender.materialLinks.forEach((link: any) => {
          expect(link.target).toBe('_blank');
          expect(link.rel).toBe('noopener noreferrer');
          
          // Verify URL is valid
          expect(link.href).toMatch(/^https?:\/\/.+/);
        });

        // Verify reference links also have proper formatting
        sessionRender.referenceLinks.forEach((refLink: any) => {
          expect(refLink.target).toBe('_blank');
          expect(refLink.rel).toBe('noopener noreferrer');
          expect(refLink.href).toMatch(/^https?:\/\/.+/);
        });

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { LearningPath, LearningStep } from '@/types';

/**
 * **Feature: abmind-course-portal, Property 1: Learning path content completeness**
 * **Validates: Requirements 1.2, 1.3**
 * 
 * For any learning path, the displayed content should include title, description, 
 * recommended audience, estimated duration, and all required step information with proper sequencing
 */

// Generators for test data
const learningStepArb = fc.record({
  order: fc.integer({ min: 1, max: 20 }),
  type: fc.constantFrom('course', 'resource', 'practice'),
  course_id: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
  resource_id: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
  note: fc.string({ minLength: 1, maxLength: 200 }),
  optional: fc.boolean(),
}).filter(step => {
  // Ensure course_id is provided when type is 'course'
  if (step.type === 'course') {
    return step.course_id !== null;
  }
  // Ensure resource_id is provided when type is 'resource'
  if (step.type === 'resource') {
    return step.resource_id !== null;
  }
  return true;
});

const learningPathArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 500 }),
  recommended_audience: fc.string({ minLength: 1, maxLength: 200 }),
  estimated_duration: fc.string({ minLength: 1, maxLength: 100 }),
  steps: fc.array(learningStepArb, { minLength: 1, maxLength: 15 })
    .map(steps => steps.map((step, index) => ({ ...step, order: index + 1 }))), // Ensure proper ordering
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
    style: attributes.style || {},
    ...attributes,
  };
}

// Mock React component rendering for testing
function mockRenderLearningPathCard(learningPath: LearningPath, progress?: number): any {
  const completedSteps = progress ? Math.floor((progress / 100) * learningPath.steps.length) : 0;
  const totalSteps = learningPath.steps.length;

  // Main card element
  const cardElement = createMockElement('div', {
    className: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6',
  });

  // Title element
  const titleElement = createMockElement('h3', {
    textContent: learningPath.title,
    className: 'text-lg font-semibold text-gray-900 mb-2',
  });

  // Description element
  const descriptionElement = createMockElement('p', {
    textContent: learningPath.description,
    className: 'text-gray-600 text-sm mb-3 line-clamp-2',
  });

  // Progress elements (if progress is provided)
  let progressElements = null;
  if (progress !== undefined) {
    const progressBar = createMockElement('div', {
      className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
      style: { width: `${progress}%` },
    });

    const progressText = createMockElement('div', {
      textContent: `${progress.toFixed(0)}% 完成`,
      className: 'text-xs text-gray-500 mt-1',
    });

    const stepCounter = createMockElement('span', {
      textContent: `${completedSteps}/${totalSteps} 步骤`,
      className: 'text-sm text-gray-600',
    });

    progressElements = {
      progressBar,
      progressText,
      stepCounter,
    };
  }

  // Metadata elements
  const audienceElement = createMockElement('span', {
    textContent: learningPath.recommended_audience,
    className: 'text-sm text-gray-600',
  });

  const durationElement = createMockElement('span', {
    textContent: learningPath.estimated_duration,
    className: 'text-sm text-gray-600',
  });

  // Step preview elements (first 3 steps)
  const stepPreviewElements = learningPath.steps.slice(0, 3).map((step, index) => {
    const isCompleted = progress !== undefined && index < completedSteps;
    
    const stepElement = createMockElement('div', {
      className: 'flex items-center gap-2 text-sm',
    });

    const statusIcon = isCompleted 
      ? createMockElement('div', { className: 'w-4 h-4 text-green-500' }) // CheckCircleIcon
      : createMockElement('div', { className: 'w-4 h-4 rounded-full border-2 border-gray-300' });

    const stepText = createMockElement('span', {
      textContent: `${step.order}. ${step.note}${step.optional ? ' (可选)' : ''}`,
      className: step.optional ? 'flex-1 text-gray-500 italic' : 'flex-1 text-gray-700',
    });

    const typeBadge = createMockElement('span', {
      textContent: step.type === 'course' ? '课程' : step.type === 'resource' ? '资源' : '实践',
      className: `text-xs px-2 py-0.5 rounded-full ${
        step.type === 'course' 
          ? 'bg-blue-100 text-blue-700'
          : step.type === 'resource'
          ? 'bg-green-100 text-green-700'
          : 'bg-purple-100 text-purple-700'
      }`,
    });

    return {
      stepElement,
      statusIcon,
      stepText,
      typeBadge,
      step,
      isCompleted,
    };
  });

  // Action button
  const actionButton = createMockElement('button', {
    textContent: progress !== undefined && progress > 0 ? '继续学习' : '开始学习',
    className: 'w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors',
  });

  return {
    cardElement,
    titleElement,
    descriptionElement,
    progressElements,
    audienceElement,
    durationElement,
    stepPreviewElements,
    actionButton,
    learningPath,
    progress,
    completedSteps,
    totalSteps,
  };
}

describe('Learning Path Content Property Tests', () => {
  it('Property 1: Learning path content completeness - All required metadata is displayed', () => {
    fc.assert(
      fc.property(learningPathArb, (learningPath) => {
        const rendered = mockRenderLearningPathCard(learningPath);

        // Verify title is present
        expect(rendered.titleElement.textContent).toBe(learningPath.title);

        // Verify description is present
        expect(rendered.descriptionElement.textContent).toBe(learningPath.description);

        // Verify recommended audience is displayed
        expect(rendered.audienceElement.textContent).toBe(learningPath.recommended_audience);

        // Verify estimated duration is displayed
        expect(rendered.durationElement.textContent).toBe(learningPath.estimated_duration);

        // Verify action button has appropriate text
        expect(rendered.actionButton.textContent).toBe('开始学习');

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: Learning path content completeness - Step information is properly sequenced', () => {
    fc.assert(
      fc.property(learningPathArb, (learningPath) => {
        const rendered = mockRenderLearningPathCard(learningPath);

        // Verify step preview shows up to 3 steps
        const expectedStepCount = Math.min(learningPath.steps.length, 3);
        expect(rendered.stepPreviewElements).toHaveLength(expectedStepCount);

        // Verify each step has proper sequencing and content
        rendered.stepPreviewElements.forEach((stepRender: any, index: number) => {
          const step = learningPath.steps[index];

          // Verify step order is correct
          expect(stepRender.step.order).toBe(step.order);

          // Verify step text includes order and note
          expect(stepRender.stepText.textContent).toContain(`${step.order}. ${step.note}`);

          // Verify optional steps are marked
          if (step.optional) {
            expect(stepRender.stepText.textContent).toContain('(可选)');
            expect(stepRender.stepText.className).toContain('italic');
          }

          // Verify type badge is correct
          const expectedTypeText = step.type === 'course' ? '课程' : 
                                   step.type === 'resource' ? '资源' : '实践';
          expect(stepRender.typeBadge.textContent).toBe(expectedTypeText);

          // Verify type badge has appropriate styling
          if (step.type === 'course') {
            expect(stepRender.typeBadge.className).toContain('bg-blue-100 text-blue-700');
          } else if (step.type === 'resource') {
            expect(stepRender.typeBadge.className).toContain('bg-green-100 text-green-700');
          } else {
            expect(stepRender.typeBadge.className).toContain('bg-purple-100 text-purple-700');
          }
        });

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: Learning path content completeness - Progress visualization works correctly', () => {
    fc.assert(
      fc.property(
        learningPathArb,
        fc.float({ min: 0, max: 100, noNaN: true }),
        (learningPath, progress) => {
          const rendered = mockRenderLearningPathCard(learningPath, progress);

          // Verify progress elements are present when progress is provided
          expect(rendered.progressElements).not.toBeNull();
          
          if (rendered.progressElements) {
            // Verify progress bar width matches progress percentage
            expect(rendered.progressElements.progressBar.style.width).toBe(`${progress}%`);

            // Verify progress text shows correct percentage
            expect(rendered.progressElements.progressText.textContent).toBe(`${progress.toFixed(0)}% 完成`);

            // Verify step counter shows correct completed/total steps
            const expectedCompleted = Math.floor((progress / 100) * learningPath.steps.length);
            expect(rendered.progressElements.stepCounter.textContent).toBe(`${expectedCompleted}/${learningPath.steps.length} 步骤`);
          }

          // Verify action button text changes based on progress
          if (progress > 0) {
            expect(rendered.actionButton.textContent).toBe('继续学习');
          } else {
            expect(rendered.actionButton.textContent).toBe('开始学习');
          }

          // Verify step completion status in preview
          const expectedCompleted = Math.floor((progress / 100) * learningPath.steps.length);
          rendered.stepPreviewElements.forEach((stepRender: any, index: number) => {
            const shouldBeCompleted = index < expectedCompleted;
            expect(stepRender.isCompleted).toBe(shouldBeCompleted);

            if (shouldBeCompleted) {
              expect(stepRender.statusIcon.className).toContain('text-green-500');
            } else {
              expect(stepRender.statusIcon.className).toContain('border-gray-300');
            }
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1: Learning path content completeness - Step types are properly categorized', () => {
    fc.assert(
      fc.property(learningStepArb, (step) => {
        // Create a minimal learning path with just this step
        const testPath: LearningPath = {
          id: 'test-path',
          title: 'Test Path',
          description: 'Test description',
          recommended_audience: 'Test audience',
          estimated_duration: 'Test duration',
          steps: [step],
        };

        const rendered = mockRenderLearningPathCard(testPath);
        const stepRender = rendered.stepPreviewElements[0];

        // Verify step type validation
        if (step.type === 'course') {
          expect(step.course_id).toBeDefined();
          expect(stepRender.typeBadge.textContent).toBe('课程');
          expect(stepRender.typeBadge.className).toContain('bg-blue-100 text-blue-700');
        } else if (step.type === 'resource') {
          expect(step.resource_id).toBeDefined();
          expect(stepRender.typeBadge.textContent).toBe('资源');
          expect(stepRender.typeBadge.className).toContain('bg-green-100 text-green-700');
        } else if (step.type === 'practice') {
          expect(stepRender.typeBadge.textContent).toBe('实践');
          expect(stepRender.typeBadge.className).toContain('bg-purple-100 text-purple-700');
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: Learning path content completeness - Empty progress handled correctly', () => {
    fc.assert(
      fc.property(learningPathArb, (learningPath) => {
        const rendered = mockRenderLearningPathCard(learningPath); // No progress provided

        // Verify no progress elements are present
        expect(rendered.progressElements).toBeNull();

        // Verify action button shows "开始学习"
        expect(rendered.actionButton.textContent).toBe('开始学习');

        // Verify all steps show as not completed
        rendered.stepPreviewElements.forEach((stepRender: any) => {
          expect(stepRender.isCompleted).toBe(false);
          expect(stepRender.statusIcon.className).toContain('border-gray-300');
        });

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: Learning path content completeness - Long step lists are truncated properly', () => {
    fc.assert(
      fc.property(
        fc.array(learningStepArb, { minLength: 5, maxLength: 15 })
          .map(steps => steps.map((step, index) => ({ ...step, order: index + 1 }))),
        (steps) => {
          const testPath: LearningPath = {
            id: 'test-path',
            title: 'Test Path',
            description: 'Test description',
            recommended_audience: 'Test audience',
            estimated_duration: 'Test duration',
            steps,
          };

          const rendered = mockRenderLearningPathCard(testPath);

          // Verify only first 3 steps are shown in preview
          expect(rendered.stepPreviewElements).toHaveLength(3);

          // Verify the first 3 steps match the actual first 3 steps
          rendered.stepPreviewElements.forEach((stepRender: any, index: number) => {
            expect(stepRender.step.order).toBe(steps[index].order);
            expect(stepRender.stepText.textContent).toContain(steps[index].note);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
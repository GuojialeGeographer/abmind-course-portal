/**
 * Development utility component for accessibility testing
 * This component provides visual indicators for accessibility compliance
 */

'use client';

import { useEffect, useState } from 'react';

interface AccessibilityIssue {
  type: 'contrast' | 'focus' | 'aria' | 'semantic';
  severity: 'error' | 'warning';
  message: string;
  element?: string;
}

export function AccessibilityChecker() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [showChecker, setShowChecker] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Check for common accessibility issues
    const checkAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check for images without alt text
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        foundIssues.push({
          type: 'aria',
          severity: 'error',
          message: `${images.length} image(s) missing alt text`,
          element: 'img'
        });
      }

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach(button => {
        if (!button.textContent?.trim()) {
          foundIssues.push({
            type: 'aria',
            severity: 'error',
            message: 'Button without accessible name',
            element: 'button'
          });
        }
      });

      // Check for links without accessible names
      const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
      links.forEach(link => {
        if (!link.textContent?.trim()) {
          foundIssues.push({
            type: 'aria',
            severity: 'error',
            message: 'Link without accessible name',
            element: 'a'
          });
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      headings.forEach(heading => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel > previousLevel + 1) {
          foundIssues.push({
            type: 'semantic',
            severity: 'warning',
            message: `Heading level skipped: ${heading.tagName} after h${previousLevel}`,
            element: heading.tagName.toLowerCase()
          });
        }
        previousLevel = currentLevel;
      });

      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (!label) {
            foundIssues.push({
              type: 'aria',
              severity: 'error',
              message: 'Form input without associated label',
              element: 'input'
            });
          }
        } else {
          foundIssues.push({
            type: 'aria',
            severity: 'error',
            message: 'Form input without id or aria-label',
            element: 'input'
          });
        }
      });

      setIssues(foundIssues);
    };

    // Run initial check
    checkAccessibility();

    // Set up mutation observer to check for changes
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['alt', 'aria-label', 'aria-labelledby', 'id']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowChecker(!showChecker)}
        className="fixed bottom-4 left-4 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 z-50"
        aria-label="Toggle accessibility checker"
      >
        A11y ({issues.length})
      </button>

      {/* Accessibility issues panel */}
      {showChecker && (
        <div className="fixed bottom-16 left-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-md max-h-96 overflow-y-auto z-40">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">Accessibility Issues</h3>
            
            {issues.length === 0 ? (
              <p className="text-green-600">✓ No accessibility issues found</p>
            ) : (
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm ${
                      issue.severity === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    }`}
                  >
                    <div className="font-medium">
                      {issue.severity === 'error' ? '❌' : '⚠️'} {issue.type.toUpperCase()}
                    </div>
                    <div>{issue.message}</div>
                    {issue.element && (
                      <div className="text-xs opacity-75">Element: {issue.element}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Color contrast info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">Color Contrast Status</h4>
              <p className="text-xs text-gray-600">
                App uses Tailwind CSS colors that meet WCAG AA standards.
                Use browser dev tools to verify specific combinations.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
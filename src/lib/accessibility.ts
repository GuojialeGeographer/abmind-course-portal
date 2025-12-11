/**
 * Accessibility utilities for focus management and WCAG compliance
 */

// Focus management utilities
export const focusManagement = {
  /**
   * Trap focus within a container element
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Restore focus to a previously focused element
   */
  restoreFocus: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  },

  /**
   * Move focus to the first focusable element in a container
   */
  focusFirst: (container: HTMLElement) => {
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (focusableElement) {
      focusableElement.focus();
    }
  }
};

// WCAG color contrast utilities
export const colorContrast = {
  /**
   * Calculate relative luminance of a color
   */
  getLuminance: (r: number, g: number, b: number): number => {
    const normalize = (c: number) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    
    const rs = normalize(r);
    const gs = normalize(g);
    const bs = normalize(b);
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const lum1 = colorContrast.getLuminance(...color1);
    const lum2 = colorContrast.getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if color combination meets WCAG AA standards
   */
  meetsWCAGAA: (foreground: [number, number, number], background: [number, number, number]): boolean => {
    const ratio = colorContrast.getContrastRatio(foreground, background);
    return ratio >= 4.5; // WCAG AA standard for normal text
  },

  /**
   * Check if color combination meets WCAG AAA standards
   */
  meetsWCAGAAA: (foreground: [number, number, number], background: [number, number, number]): boolean => {
    const ratio = colorContrast.getContrastRatio(foreground, background);
    return ratio >= 7; // WCAG AAA standard for normal text
  }
};

// Screen reader utilities
export const screenReader = {
  /**
   * Announce content to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Create visually hidden text for screen readers
   */
  createScreenReaderText: (text: string): HTMLSpanElement => {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  }
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  /**
   * Handle escape key to close modals/menus
   */
  handleEscape: (callback: () => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Handle arrow key navigation in lists
   */
  handleArrowNavigation: (
    container: HTMLElement,
    onUp: () => void,
    onDown: () => void,
    onLeft?: () => void,
    onRight?: () => void
  ) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onDown();
          break;
        case 'ArrowLeft':
          if (onLeft) {
            e.preventDefault();
            onLeft();
          }
          break;
        case 'ArrowRight':
          if (onRight) {
            e.preventDefault();
            onRight();
          }
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
};
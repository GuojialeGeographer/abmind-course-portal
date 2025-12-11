'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { focusManagement, keyboardNavigation } from '@/lib/accessibility';

interface NavigationItem {
  label: string;
  href: string;
}

interface NavigationProps {
  items?: NavigationItem[];
}

const defaultNavItems: NavigationItem[] = [
  { label: '首页', href: '/' },
  { label: '课程', href: '/courses' },
  { label: '学习路径', href: '/learning-paths' },
  { label: '应用领域', href: '/domains' },
  { label: '资源', href: '/resources' },
  { label: '关于', href: '/about' },
];

export function Navigation({ items = defaultNavItems }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Return focus to menu button when closing
    if (mobileMenuButtonRef.current) {
      mobileMenuButtonRef.current.focus();
    }
  };

  // Handle escape key and focus trapping for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      // Focus first menu item when opening
      focusManagement.focusFirst(mobileMenuRef.current);
      
      // Trap focus within mobile menu
      const cleanup = focusManagement.trapFocus(mobileMenuRef.current);
      
      // Handle escape key
      const escapeCleanup = keyboardNavigation.handleEscape(closeMobileMenu);
      
      return () => {
        cleanup();
        escapeCleanup();
      };
    }
    
    return () => {
      // No cleanup needed when menu is closed
    };
  }, [isMobileMenuOpen]);

  return (
    <nav 
      className="bg-white shadow-sm border-b border-gray-200"
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="ABMind Course Portal 首页"
            >
              ABMind
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isActiveLink(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  )}
                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={mobileMenuButtonRef}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "关闭主菜单" : "打开主菜单"}
            >
              <span className="sr-only">打开主菜单</span>
              {/* Hamburger icon */}
              <svg
                className={clsx('h-6 w-6', isMobileMenuOpen ? 'hidden' : 'block')}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={clsx('h-6 w-6', isMobileMenuOpen ? 'block' : 'hidden')}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        ref={mobileMenuRef}
        className={clsx('md:hidden', isMobileMenuOpen ? 'block' : 'hidden')}
        id="mobile-menu"
        role="menu"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isActiveLink(item.href)
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              )}
              aria-current={isActiveLink(item.href) ? 'page' : undefined}
              onClick={closeMobileMenu}
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
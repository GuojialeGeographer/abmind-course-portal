import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { AccessibilityChecker } from '../accessibility/AccessibilityChecker';

interface AppLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

export function AppLayout({ 
  children, 
  showBreadcrumbs = false, 
  breadcrumbItems = [] 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        跳转到主要内容
      </a>
      
      <Navigation />
      
      {showBreadcrumbs && breadcrumbItems.length > 0 && (
        <Breadcrumbs items={breadcrumbItems} />
      )}
      
      <main 
        id="main-content" 
        className="flex-1"
        role="main"
      >
        {children}
      </main>
      
      <Footer />
      
      {/* Development accessibility checker */}
      <AccessibilityChecker />
    </div>
  );
}
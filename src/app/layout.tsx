import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout';
import { generateMetadata as generateSEOMetadata, generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/seo';

// Optimized font loading for Chinese content
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

// Chinese fonts with optimized loading
const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

const notoSerifSC = Noto_Serif_SC({
  variable: '--font-noto-serif-sc',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = generateSEOMetadata({
  title: 'ABMind Course Portal - Agent-Based Modeling 中文社区',
  description: 'ABMind 是专注于 Agent-Based Modeling (ABM) 和 Mesa 框架的中文学习社区，提供系统化的课程资源和学习路径，涵盖城市建模、环境仿真、交通建模等应用领域。',
  keywords: [
    'Agent-Based Modeling',
    'ABM',
    'Mesa',
    'Python',
    '多智能体建模',
    '复杂系统',
    '仿真建模',
    '城市建模',
    '环境建模',
    '交通建模',
    '中文社区',
    '在线课程',
    '学习资源'
  ],
  type: 'website',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationData = generateOrganizationStructuredData();
  const websiteData = generateWebsiteStructuredData();

  return (
    <html lang="zh-CN">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData),
          }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//raw.githubusercontent.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        
        {/* Viewport and mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Language and locale */}
        <meta httpEquiv="Content-Language" content="zh-CN" />
        <meta name="language" content="Chinese" />
        <meta name="geo.region" content="CN" />
        <meta name="geo.placename" content="China" />
        
        {/* Language alternatives */}
        <link rel="alternate" hrefLang="zh-CN" href="https://abmind.org" />
        <link rel="alternate" hrefLang="zh-Hans" href="https://abmind.org" />
        <link rel="alternate" hrefLang="en-US" href="https://en.abmind.org" />
        <link rel="alternate" hrefLang="x-default" href="https://abmind.org" />
        
        {/* Chinese search engines optimization */}
        <meta name="baidu-site-verification" content={process.env.BAIDU_SITE_VERIFICATION || ''} />
        <meta name="sogou_site_verification" content={process.env.SOGOU_SITE_VERIFICATION || ''} />
        <meta name="360-site-verification" content={process.env.QIHOO_360_VERIFICATION || ''} />
        
        {/* Chinese social platforms */}
        <meta property="wb:webmaster" content={process.env.WEIBO_WEBMASTER || ''} />
        
        {/* Font preloading for Chinese fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} ${notoSerifSC.variable} antialiased`}
        style={{
          fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}

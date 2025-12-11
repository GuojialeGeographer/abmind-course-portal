import Link from 'next/link';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface FooterProps {
  socialLinks?: SocialLink[];
}

const defaultSocialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/abmind', icon: 'github' },
  { name: 'WeChat', url: 'https://weixin.qq.com/abmind', icon: 'wechat' },
  { name: 'Bilibili', url: 'https://space.bilibili.com/abmind', icon: 'bilibili' },
  { name: 'Email', url: 'mailto:contact@abmind.org', icon: 'email' },
];

// Simple icon components
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const WeChatIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.900 7.852.194-.242-2.751-2.85-4.900-6.425-4.900z"/>
    <path d="M23.999 14.6c0-3.573-3.341-6.467-7.486-6.467-4.566 0-7.486 3.663-7.486 6.467 0 3.805 3.919 6.467 7.486 6.467a8.29 8.29 0 0 0 2.26-.32.59.59 0 0 1 .535.054l1.528.903a.25.25 0 0 0 .128.041c.128 0 .23-.103.230-.23 0-.055-.025-.106-.038-.158l-.322-1.25a.463.463 0 0 1 .167-.535c1.548-1.204 2.498-2.772 2.498-4.472z"/>
  </svg>
);

const BilibiliIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906zM6.747 15.120c.356 0 .653-.124.893-.373.24-.249.36-.547.36-.893 0-.347-.12-.644-.36-.893a1.206 1.206 0 0 0-.893-.373c-.347 0-.644.124-.893.373-.249.249-.373.546-.373.893 0 .346.124.644.373.893.249.249.546.373.893.373zm10.507 0c.356 0 .653-.124.893-.373.24-.249.36-.547.36-.893 0-.347-.12-.644-.36-.893a1.206 1.206 0 0 0-.893-.373c-.347 0-.644.124-.893.373-.249.249-.373.546-.373.893 0 .346.124.644.373.893.249.249.546.373.893.373z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'github':
      return <GitHubIcon />;
    case 'wechat':
      return <WeChatIcon />;
    case 'bilibili':
      return <BilibiliIcon />;
    case 'email':
      return <EmailIcon />;
    default:
      return null;
  }
};

export function Footer({ socialLinks = defaultSocialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-50 border-t border-gray-200"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ABMind Course Portal
            </h3>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Agent-Based Modeling 中文学习社区，提供系统化的 ABM 和 Mesa 框架学习资源，
              专注于地理、城市和环境仿真应用。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label={`访问我们的 ${link.name}`}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {getIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/courses" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                  浏览课程
                </Link>
              </li>
              <li>
                <Link 
                  href="/learning-paths" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                  学习路径
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                  学习资源
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} ABMind Course Portal. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}
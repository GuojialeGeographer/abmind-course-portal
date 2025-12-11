# ABMind Course Portal

> Agent-Based Modeling 中文学习社区课程门户

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/abmind-course-portal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 项目简介

ABMind Course Portal 是由 Mesa 核心开发者 **Boyu Wang** 和 ABM 研究专家 **Shuang Song** 联合发起的中文 Agent-Based Modeling 学习社区门户网站。

我们致力于为中文用户提供高质量的 ABM 和 Mesa 框架学习资源，降低学习门槛，促进复杂系统科学在中文世界的发展和应用。

## ✨ 主要特性

- 🎓 **系统化课程** - 从入门到高级的完整学习路径
- 👥 **真实讲师** - 由 Mesa 核心开发者和 ABM 专家授课
- 📚 **丰富资源** - Mesa 官方文档、教程和社区资源
- 🌐 **中文友好** - 专为中文用户优化的学习体验
- 📱 **响应式设计** - 完美支持桌面和移动设备
- ♿ **无障碍访问** - 符合 WCAG 2.1 标准

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/abmind-course-portal.git
cd abmind-course-portal

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建和部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 或者导出静态文件
npm run build:static
```

## 👥 核心团队

### 联合创始人

- **[Shuang Song](https://www.gea.mpg.de/person/137764)** - 马克思·普朗克研究所博士后研究员
- **[Boyu Wang](https://wang-boyu.github.io)** - Mesa 核心开发者，布法罗大学博士生

### 核心贡献者

- **[Xin Lin](https://github.com/peter-kinger)** - Mesa 维护者，中国地质大学硕士生
- **[Jiale Guo](https://guojialegeographer.github.io)** - 社区运营，米兰理工大学硕士生
- **[Bo Hu](https://hubo-home.com)** - 社区运营，南京大学博士生
- **[Adam Zhou](https://github.com/AdamZh0u)** - Mesa 维护者，伦敦大学学院博士生

## 📖 课程内容

### 精品课程

1. **Mesa 3.0 新手指南** - Mesa 框架全面入门
2. **Mesa Framework Advanced Workshop** - 高级技术和可视化
3. **Agent-Based Modeling Basics** - ABM 基础概念和实践
4. **Urban Systems Agent-Based Modeling** - 城市系统建模应用

### 学习路径

- 🎯 **ABM从零开始** - 适合完全初学者
- 🏙️ **Urban ABM Specialist Path** - 城市规划专业路径
- 🔬 **科研导向学习路径** - 面向学术研究

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **测试**: Vitest + Testing Library
- **部署**: Vercel
- **CI/CD**: GitHub Actions

## 📦 项目结构

```
abmind-course-portal/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   ├── components/          # React 组件
│   ├── lib/                 # 工具函数和配置
│   ├── hooks/               # 自定义 React Hooks
│   └── types/               # TypeScript 类型定义
├── data/                    # 课程和资源数据 (YAML)
├── scripts/                 # 构建和部署脚本
├── .github/workflows/       # GitHub Actions 工作流
└── docs/                    # 项目文档
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 测试覆盖率
npm run test:coverage

# 内容验证
npm run validate:all
```

## 📝 贡献指南

我们欢迎社区贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 贡献方式

1. 🐛 报告 Bug
2. 💡 提出新功能建议
3. 📚 改进文档
4. 🎓 贡献课程内容
5. 🔧 提交代码修复

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

## 🔗 相关链接

- **Mesa 项目**: https://github.com/projectmesa/mesa
- **PaperBell**: https://paperbell.cn/
- **DHTech**: https://dh-tech.github.io/
- **GISphere**: https://gisphere.info/school

## 📞 联系我们

- **GitHub Issues**: [提交问题](https://github.com/your-username/abmind-course-portal/issues)
- **讨论区**: [GitHub Discussions](https://github.com/your-username/abmind-course-portal/discussions)

---

**让我们一起推动 Agent-Based Modeling 在中文世界的发展！** 🚀

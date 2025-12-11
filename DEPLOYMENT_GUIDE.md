# ABMind Course Portal 部署指南

## 部署选项

### 1. Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 准备工作

1. **创建 Vercel 账户**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录

2. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **登录 Vercel**
   ```bash
   vercel login
   ```

#### 部署步骤

1. **初始化项目**
   ```bash
   cd abmind-course-portal
   vercel
   ```
   
2. **配置项目**
   - 选择项目名称：`abmind-course-portal`
   - 选择团队（如果有）
   - 确认项目设置

3. **生产部署**
   ```bash
   vercel --prod
   ```

#### 环境变量设置

在 Vercel Dashboard 中设置以下环境变量：

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 2. GitHub Pages 部署

适合静态网站托管，完全免费。

#### 准备工作

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **配置 GitHub Pages**
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 选项
   - 选择 "GitHub Actions" 作为源

3. **创建部署工作流**
   
   创建 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout
         uses: actions/checkout@v4
         
       - name: Setup Node.js
         uses: actions/setup-node@v4
         with:
           node-version: '18'
           cache: 'npm'
           
       - name: Install dependencies
         run: npm ci
         
       - name: Build
         run: npm run build
         env:
           NEXT_PUBLIC_BASE_PATH: /abmind-course-portal
           
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./out
   ```

### 3. 自定义域名配置

#### Vercel 自定义域名

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 "Domains" 选项卡
3. 添加您的域名
4. 按照提示配置 DNS 记录

#### GitHub Pages 自定义域名

1. 在仓库设置中的 "Pages" 部分
2. 在 "Custom domain" 字段输入域名
3. 配置 DNS CNAME 记录指向 `username.github.io`

## 部署后验证

### 功能检查清单

- [ ] 首页正常加载
- [ ] 所有导航链接工作正常
- [ ] 课程页面显示正确
- [ ] 学习路径页面功能正常
- [ ] 资源页面链接有效
- [ ] 关于页面信息准确
- [ ] 响应式设计在移动设备上正常
- [ ] SEO 元数据正确设置
- [ ] 网站性能良好（Lighthouse 评分 > 90）

### 性能监控

使用以下工具监控网站性能：

1. **Google PageSpeed Insights**
   - 访问 [pagespeed.web.dev](https://pagespeed.web.dev)
   - 输入网站 URL 进行测试

2. **Vercel Analytics**（如果使用 Vercel）
   - 在 Vercel Dashboard 中启用 Analytics
   - 监控访问量和性能指标

3. **Google Analytics**（可选）
   - 设置 Google Analytics 跟踪代码
   - 监控用户行为和流量

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查依赖
   npm ci
   
   # 本地构建测试
   npm run build
   
   # 检查 TypeScript 错误
   npm run type-check
   ```

2. **样式问题**
   - 确保 Tailwind CSS 配置正确
   - 检查 CSS 文件是否正确导入

3. **路由问题**
   - 验证 Next.js 路由配置
   - 检查动态路由参数

4. **环境变量问题**
   - 确保所有必需的环境变量已设置
   - 检查变量名称是否正确

### 回滚部署

#### Vercel 回滚
```bash
# 查看部署历史
vercel ls

# 回滚到特定部署
vercel rollback [deployment-url]
```

#### GitHub Pages 回滚
```bash
# 回滚到上一个提交
git revert HEAD
git push origin main
```

## 维护和更新

### 定期维护任务

1. **依赖更新**
   ```bash
   # 检查过时的依赖
   npm outdated
   
   # 更新依赖
   npm update
   ```

2. **安全更新**
   ```bash
   # 检查安全漏洞
   npm audit
   
   # 修复安全问题
   npm audit fix
   ```

3. **内容更新**
   - 定期更新课程信息
   - 添加新的学习资源
   - 更新讲师信息

### 监控和日志

1. **Vercel 日志**
   - 在 Vercel Dashboard 中查看函数日志
   - 监控错误和性能指标

2. **GitHub Actions 日志**
   - 在 GitHub 仓库的 "Actions" 选项卡中查看构建日志
   - 监控部署状态

## 联系支持

如果遇到部署问题，可以：

1. 查看 [Next.js 部署文档](https://nextjs.org/docs/deployment)
2. 查看 [Vercel 文档](https://vercel.com/docs)
3. 在项目 GitHub 仓库中创建 Issue
4. 联系 ABMind 社区成员获取帮助

---

**注意**: 部署前请确保所有测试通过，并在本地环境中验证所有功能正常工作。
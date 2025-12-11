# Vercel 部署指南

## 🚀 方法一：通过GitHub自动部署（推荐）

### 步骤1: 推送代码到GitHub

1. **创建GitHub仓库**
   - 访问 [GitHub](https://github.com) 并登录
   - 点击 "New repository"
   - 仓库名: `abmind-course-portal`
   - 设为Public（推荐）
   - 不要添加README、.gitignore或License

2. **推送代码**
   ```bash
   # 在 abmind-course-portal 目录中执行
   git remote add origin https://github.com/YOUR_USERNAME/abmind-course-portal.git
   git push -u origin main
   ```

   或者使用我们提供的脚本：
   ```bash
   ./setup-github.sh YOUR_GITHUB_USERNAME
   ```

### 步骤2: 连接Vercel

1. **访问Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 点击 "Sign Up" 或 "Log In"
   - 选择 "Continue with GitHub"

2. **导入项目**
   - 登录后点击 "New Project"
   - 在GitHub仓库列表中找到 `abmind-course-portal`
   - 点击 "Import"

3. **配置项目**
   - **Project Name**: `abmind-course-portal`
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（自动设置）
   - **Output Directory**: `out`（自动设置）
   - **Install Command**: `npm ci`（自动设置）

4. **环境变量**（可选）
   - 点击 "Environment Variables"
   - 添加以下变量：
     ```
     NODE_ENV=production
     NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
     ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常2-3分钟）

### 步骤3: 获取部署URL

部署成功后，你将获得：
- **预览URL**: `https://abmind-course-portal-xxx.vercel.app`
- **生产URL**: `https://abmind-course-portal.vercel.app`

## 🔧 方法二：使用Vercel CLI

### 安装Vercel CLI

```bash
npm i -g vercel
```

### 登录和部署

```bash
# 登录Vercel
vercel login

# 在项目目录中部署
cd abmind-course-portal
vercel

# 生产部署
vercel --prod
```

## 🌐 自定义域名设置

### 在Vercel Dashboard中设置

1. 进入项目设置页面
2. 点击 "Domains" 选项卡
3. 点击 "Add Domain"
4. 输入你的域名（如 `abmind.org`）
5. 按照提示配置DNS记录

### DNS配置示例

如果你的域名是 `abmind.org`：

```
类型: CNAME
名称: www
值: cname.vercel-dns.com

类型: A
名称: @
值: 76.76.19.61
```

## 🔄 自动部署

连接GitHub后，每次推送代码到main分支都会自动触发部署：

```bash
# 修改代码后
git add .
git commit -m "Update content"
git push origin main
# Vercel会自动开始新的部署
```

## 📊 监控和分析

### Vercel Analytics

1. 在项目设置中启用 "Analytics"
2. 查看访问量、性能指标等数据

### 性能监控

- **Core Web Vitals**: 自动监控页面性能
- **Function Logs**: 查看服务器端日志
- **Build Logs**: 查看构建过程日志

## 🛠️ 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 本地测试构建
   npm run build
   
   # 检查错误日志
   vercel logs
   ```

2. **环境变量问题**
   - 确保在Vercel Dashboard中正确设置
   - 重新部署以应用新的环境变量

3. **域名配置问题**
   - 检查DNS记录是否正确
   - 等待DNS传播（可能需要24-48小时）

### 回滚部署

```bash
# 查看部署历史
vercel ls

# 回滚到特定版本
vercel rollback [deployment-url]
```

## 🎯 部署检查清单

部署完成后，请验证以下功能：

- [ ] 网站可以正常访问
- [ ] 所有页面加载正常
- [ ] 导航功能正常
- [ ] 课程页面显示正确
- [ ] 移动端响应式正常
- [ ] 搜索功能工作
- [ ] 外部链接可访问
- [ ] SEO元数据正确

## 📈 优化建议

### 性能优化

1. **图片优化**: 使用WebP格式
2. **字体优化**: 预加载关键字体
3. **代码分割**: 按需加载组件
4. **缓存策略**: 配置适当的缓存头

### SEO优化

1. **Sitemap**: 自动生成XML sitemap
2. **Meta标签**: 完善页面元数据
3. **结构化数据**: 添加JSON-LD标记
4. **页面速度**: 保持Core Web Vitals绿色

## 🎉 部署成功！

恭喜！你的ABMind Course Portal现在已经成功部署到Vercel。

**下一步建议：**

1. 🔗 设置自定义域名
2. 📊 启用Vercel Analytics
3. 🔔 配置部署通知
4. 📝 更新README中的部署URL
5. 🎯 开始推广你的学习平台

---

**需要帮助？** 查看 [Vercel文档](https://vercel.com/docs) 或在项目Issues中提问。
# 部署选项指南

## 🚀 选项一：Vercel 部署（推荐）

### 简化的 Vercel 部署步骤：

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 `abmind-course-portal` 仓库
   - 点击 "Import"

3. **配置设置**
   - **Framework Preset**: 选择 "Other" 或留空
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Install Command**: `npm ci`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 如果 Vercel 仍有问题，尝试以下设置：

在 Vercel 项目设置中：
- **Framework**: 设置为 "Other"
- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **Install Command**: `npm ci`

## 🌐 选项二：GitHub Pages 部署

### 自动部署设置：

1. **启用 GitHub Pages**
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 选项
   - Source 选择 "GitHub Actions"

2. **自动部署**
   - 我们已经创建了 `.github/workflows/deploy.yml`
   - 每次推送到 main 分支都会自动部署
   - 部署完成后访问：`https://guojialegeographer.github.io/abmind-course-portal/`

### 手动启用 GitHub Pages：

```bash
# 在 GitHub 仓库设置中：
# 1. 进入 Settings > Pages
# 2. Source 选择 "Deploy from a branch"
# 3. Branch 选择 "gh-pages"
# 4. 保存设置
```

## 🔧 选项三：其他静态托管服务

由于我们使用静态导出，项目可以部署到任何静态托管服务：

### Netlify:
1. 连接 GitHub 仓库
2. Build command: `npm run build`
3. Publish directory: `out`

### Cloudflare Pages:
1. 连接 GitHub 仓库
2. Build command: `npm run build`
3. Build output directory: `out`

### Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# 选择 'out' 作为 public directory
firebase deploy
```

## 🎯 推荐部署流程

1. **首选**: 尝试 Vercel（设置 Framework 为 "Other"）
2. **备选**: 使用 GitHub Pages（已配置自动部署）
3. **其他**: Netlify 或 Cloudflare Pages

## 🔍 故障排除

### Vercel 问题：
- 确保 Framework 设置为 "Other" 而不是 "Next.js"
- 检查 Build Command 是否为 `npm run build`
- 确认 Output Directory 是 `out`

### GitHub Pages 问题：
- 检查 Actions 是否启用
- 确认 Pages 设置中 Source 为 "GitHub Actions"
- 查看 Actions 日志了解构建错误

### 通用问题：
- 确保所有依赖都在 `package.json` 中
- 检查构建日志中的错误信息
- 验证本地 `npm run build` 是否成功
#!/bin/bash

# ABMind Course Portal - GitHub Setup Script
# 使用方法: ./setup-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "❌ 错误: 请提供GitHub用户名"
    echo "使用方法: ./setup-github.sh YOUR_GITHUB_USERNAME"
    echo "例如: ./setup-github.sh john-doe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_URL="https://github.com/${GITHUB_USERNAME}/abmind-course-portal.git"

echo "🚀 设置GitHub远程仓库..."
echo "仓库地址: $REPO_URL"

# 添加远程仓库
git remote add origin $REPO_URL

# 推送到GitHub
echo "📤 推送代码到GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 成功推送到GitHub!"
    echo "🌐 仓库地址: $REPO_URL"
    echo ""
    echo "🎯 下一步: 部署到Vercel"
    echo "1. 访问 https://vercel.com"
    echo "2. 使用GitHub账户登录"
    echo "3. 点击 'New Project'"
    echo "4. 选择 'abmind-course-portal' 仓库"
    echo "5. 点击 'Deploy'"
    echo ""
    echo "🎉 部署完成后，你将获得一个 .vercel.app 域名!"
else
    echo "❌ 推送失败，请检查:"
    echo "1. GitHub仓库是否已创建"
    echo "2. 用户名是否正确"
    echo "3. 是否有推送权限"
fi
#!/bin/bash

# 安全检查脚本
# 用于快速检查服务器是否存在安全风险

echo "🔍 开始安全检查..."
echo ""

# 1. 检查可疑进程
echo "1. 检查可疑进程..."
ps aux | grep -E "wget|curl.*5\.255\.121\.141|bash.*-i|/dev/tcp" | grep -v grep
if [ $? -eq 0 ]; then
    echo "⚠️  发现可疑进程！"
else
    echo "✅ 未发现可疑进程"
fi
echo ""

# 2. 检查网络连接
echo "2. 检查可疑网络连接..."
netstat -an 2>/dev/null | grep 5.255.121.141
if [ $? -eq 0 ]; then
    echo "⚠️  发现与可疑 IP 的连接！"
else
    echo "✅ 未发现可疑连接"
fi
echo ""

# 3. 检查定时任务
echo "3. 检查定时任务..."
crontab -l 2>/dev/null | grep -E "wget|curl|bash.*http|5\.255\.121\.141"
if [ $? -eq 0 ]; then
    echo "⚠️  发现可疑定时任务！"
else
    echo "✅ 定时任务正常"
fi
echo ""

# 4. 检查最近修改的文件
echo "4. 检查最近 1 天修改的文件（仅显示前 20 个）..."
find . -type f -mtime -1 ! -path "./node_modules/*" ! -path "./.next/*" ! -path "./.git/*" 2>/dev/null | head -20
echo ""

# 5. 检查 package.json 是否被修改
echo "5. 检查 package.json..."
if command -v git &> /dev/null; then
    git diff package.json 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "⚠️  package.json 可能被修改过"
    else
        echo "✅ package.json 正常"
    fi
else
    echo "ℹ️  未安装 git，跳过此检查"
fi
echo ""

# 6. 检查环境变量
echo "6. 检查环境变量..."
env | grep -iE "http|url|proxy|script|5\.255" | head -10
echo ""

# 7. 检查是否有可疑的 .env 文件
echo "7. 检查 .env 文件..."
if [ -f .env ]; then
    echo "⚠️  发现 .env 文件，请手动检查内容"
    echo "   文件位置: $(pwd)/.env"
else
    echo "✅ 未发现 .env 文件"
fi
echo ""

echo "✅ 检查完成！"
echo ""
echo "⚠️  注意：此脚本只做基础检查，如果发现可疑活动，请立即："
echo "   1. 断网/停止服务"
echo "   2. 检查服务器日志"
echo "   3. 考虑重装系统"


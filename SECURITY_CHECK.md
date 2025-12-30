# 服务器安全检查与应急响应指南

## 🚨 紧急响应步骤

### 1. 立即断网/停止服务

```bash
# 停止所有 Node.js 服务
pm2 stop all
# 或
pkill -f node
pkill -f next

# 停止 Nginx（如果使用）
systemctl stop nginx

# 或在云平台安全组关闭所有入站流量
```

### 2. 检查当前运行的进程

```bash
# 检查可疑进程
ps aux | grep -E "wget|curl|bash|sh|python|perl|nc|netcat"
ps aux | grep -E "node|next|pm2" | grep -v grep

# 检查网络连接
netstat -tulpn | grep ESTABLISHED
# 或
ss -tulpn | grep ESTABLISHED

# 查找连接到可疑 IP 的连接
netstat -an | grep 5.255.121.141
```

### 3. 检查最近修改的文件

```bash
# 最近 24 小时修改的文件
find / -mtime -1 -type f 2>/dev/null | grep -vE "/proc|/sys|/dev"

# 检查 .next 目录中是否有可疑文件
find .next -type f -name "*.js" -mtime -1 2>/dev/null

# 检查 node_modules 是否有可疑包
find node_modules -type f -name "*.js" -mtime -1 2>/dev/null | head -20
```

### 4. 检查定时任务

```bash
# 检查当前用户的 crontab
crontab -l

# 检查系统级 crontab
cat /etc/crontab
ls -la /etc/cron.d/
ls -la /etc/cron.hourly/
ls -la /etc/cron.daily/

# 检查是否有可疑的定时任务
grep -r "wget\|curl\|bash" /etc/cron* 2>/dev/null
```

### 5. 检查环境变量和配置文件

```bash
# 检查环境变量是否有异常
env | grep -iE "http|url|proxy|script"

# 检查 .env 文件
cat .env* 2>/dev/null

# 检查 package.json 是否有可疑脚本
cat package.json | grep -A 5 scripts
```

### 6. 检查网络请求配置

检查 `src/network/index.ts` 中的 API 端点是否被篡改：
- 确认 `init_url` 和 `img_url` 是正确的
- 检查是否有指向可疑 IP 的请求

### 7. 检查依赖包

```bash
# 检查是否有可疑的依赖
npm audit
npm list --depth=0

# 检查 package-lock.json 是否被修改
git diff package-lock.json

# 查看最近安装的包
ls -lt node_modules | head -20
```

## 🔒 安全加固建议

### 1. 环境隔离

- **不要使用 root 运行 Node.js 服务**
- 创建专用用户运行服务：
  ```bash
  useradd -m -s /bin/bash nodeuser
  chown -R nodeuser:nodeuser /path/to/your/app
  ```

### 2. 防火墙配置

只开放必要端口：
```bash
# 只允许 SSH (22), HTTP (80), HTTPS (443)
# 关闭开发端口 (3000) 对外的访问
```

### 3. 更新依赖

```bash
# 更新所有依赖到最新版本
npm update

# 运行安全审计
npm audit fix
```

### 4. 添加安全 headers

在 `next.config.ts` 中添加：
```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

### 5. 限制 API 访问

- 添加 API 认证/授权
- 使用 HTTPS
- 限制请求频率（rate limiting）
- 验证所有用户输入

### 6. 监控和日志

- 启用访问日志
- 监控异常请求
- 设置告警机制

## 🔍 当前项目安全检查清单

- ✅ 代码中无 `eval`, `exec`, `child_process` 等危险函数（除了正常的 buildZip.js）
- ✅ 网络请求都指向可信域名
- ✅ 无硬编码的敏感信息
- ⚠️ 需要确认：服务器运行时是否以非 root 用户运行
- ⚠️ 需要确认：生产环境是否正确配置了防火墙

## 📝 建议操作

1. **立即备份当前代码**（如果代码本身未被污染）
2. **检查服务器日志**：
   ```bash
   journalctl -u your-service-name -n 1000
   tail -1000 /var/log/nginx/access.log
   ```
3. **检查 git 历史**，确认是否有可疑提交：
   ```bash
   git log --all --oneline | head -50
   ```
4. **如果确认被入侵**：
   - 立即重装服务器
   - 使用新的密钥
   - 修改所有密码
   - 从干净的代码仓库重新部署


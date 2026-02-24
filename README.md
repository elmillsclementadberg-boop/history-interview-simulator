# 历史学考研复试模拟（场景化版本）

当前版本能力：
- 方向仅保留：`中国史` / `世界史`
- 复试场景模拟：椭圆桌 + 考生 + 10位老师（主考官先问）
- 老师多轮追问，支持“不会换题”“前提纠错后换题”
- 语音输入：`录音 -> 高精度转写 -> 术语纠错`
- 结束后生成整场报告，支持导出 PDF/TXT

## 架构说明（可公开给他人使用）

本项目现在是一个 Node 服务：
- 前端静态页面：`index.html` / `style.css` / `script.js`
- 后端代理：`server.js`
  - `POST /api/chat` 代理对话请求到 Groq
  - `POST /api/transcribe` 代理语音转写到 Groq
  - `GET /api/health` 健康检查
- 后端持有 `GROQ_API_KEY`，前端默认不暴露 Key
- 限流支持两种模式：
  - 默认：内存限流（重启后计数清空）
  - 可选：Redis 持久限流（推荐公网长期运行）

## 本地启动

1) 准备环境变量：

```bash
cd "/Users/abcd/Documents/重要文件/codex/历史学考研复试"
cp .env.example .env
# 编辑 .env，至少填写 GROQ_API_KEY
```

2) 启动：

```bash
npm start
```

3) 打开：

```text
http://127.0.0.1:8787
```

## 环境变量

- `GROQ_API_KEY`：必填，服务端调用 Groq 用
- `PORT`：默认 `8787`
- `HOST`：默认 `0.0.0.0`
- `RATE_LIMIT_PER_MINUTE`：每 IP 每分钟请求上限（默认 `20`）
- `DAILY_CAP_PER_IP`：每 IP 每日上限（默认 `200`）
- `DAILY_GLOBAL_CAP`：全站每日总上限（默认 `5000`）
- `JSON_BODY_LIMIT_BYTES`：JSON 请求体大小上限（默认 `524288`）
- `UPSTASH_REDIS_REST_URL`：可选，Upstash Redis REST 地址
- `UPSTASH_REDIS_REST_TOKEN`：可选，Upstash Redis REST Token

## 上线建议（免费体验版）

可选平台：Render / Railway / Fly.io / 任何支持 Node 的 VPS。

最小上线步骤：
1. 推到 GitHub。
2. 在平台创建 Web Service，启动命令 `npm start`。
3. 配置环境变量（至少 `GROQ_API_KEY`）。
4. 绑定域名（可选）。

### Render 快速配置清单

仓库内已提供 `/Users/abcd/Documents/重要文件/codex/历史学考研复试/render.yaml`。

你可以直接用 Blueprint 部署，或手动创建 Web Service：
1. 连接 GitHub 仓库并选择本项目目录。
2. Build Command：`npm install`
3. Start Command：`npm start`
4. Health Check Path：`/api/health`
5. 环境变量至少填写：
   - `GROQ_API_KEY`
6. 建议同时填写（长期稳定）：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
7. 部署后访问：
   - 首页：`https://你的域名/`
   - 健康检查：`https://你的域名/api/health`

## 上线后10分钟验收

项目内已提供脚本：`/Users/abcd/Documents/重要文件/codex/历史学考研复试/scripts/post_deploy_check.sh`

运行方式：

```bash
cd "/Users/abcd/Documents/重要文件/codex/历史学考研复试"
./scripts/post_deploy_check.sh https://你的域名
```

脚本会自动检查：
- 首页可访问
- 隐私页可访问
- `/api/health` 返回正常（并显示限流后端是 `memory` 还是 `redis`）
- `/api/chat` 可用

## 维护成本（当前架构）

- 技术维护：低到中（静态前端 + 单 Node 服务）
- 成本重点：Groq API 调用费用和防刷
- 已内置基础防护：分钟限流 + 每 IP 日限额 + 全站日限额
- 推荐上线配置：开启 Upstash Redis，限流计数在服务重启后仍保留

## 数据保存位置（当前实现）

- 浏览器本地：
  - 页面配置（接口地址/模型/API Key）保存在用户浏览器 `localStorage`
- 服务端内存：
  - 若未配置 Redis：限流计数器仅在进程内存，重启会清空
  - 若配置 Redis：限流计数器保存在 Redis（持久）
- 不落库：
  - 当前版本不写数据库，不长期存储用户问答文本
- 第三方处理：
  - 对话与语音转写请求会发送到 Groq API

## 合规与提示

- 你需在网站上提供隐私说明：用户输入/语音会发送给第三方模型服务处理。
- 不得上传或处理违法/侵权内容（需符合服务商 AUP）。
- 若后续公开规模增大，建议增加：
  - 登录或验证码
  - 更严格限流（Redis）
  - 按天预算熔断
  - 隐私政策页面与用户协议

## 相关文档

- [Groq Console](https://console.groq.com/)
- [Groq OpenAI 兼容 API](https://console.groq.com/docs/openai)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [Groq Your Data](https://console.groq.com/docs/your-data)
- [Groq Legal](https://console.groq.com/docs/legal/services-agreement)

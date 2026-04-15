# SK EPay

SK Epay 是一个基于 `NestJS + Next.js + PostgreSQL + Redis` 构建的现代化聚合支付系统，目标是兼容标准易支付参数格式与签名规则，同时默认使用现代接口路径。

当前默认接口：

- 下单：`/api/pay`
- 查询：`/api/query`
- 异步通知：`/api/notify`
- 同步返回：`/api/return`

## 项目目标

- 兼容 EPay / NewAPI 常见接入参数：`pid`、`type`、`out_trade_no`、`notify_url`、`return_url`、`name`、`money`
- 使用经典 MD5 字典序签名规则，便于对接标准易支付生态
- 支持多商户、多通道、官方微信支付/支付宝直连
- 提供管理员后台与商户后台
- 支持订单、回调、补单、退款、对账与基础分账能力

## 技术栈

- 后端：`NestJS 11`、`Node.js 20+`
- 前端：`Next.js 16`、`React 19`、`Tailwind CSS 4`、`shadcn/ui`
- 数据库：`PostgreSQL 16`
- ORM：`Prisma 7`
- 队列与缓存：`Redis`、`BullMQ`
- 部署：`Docker Compose`

## 目录结构

```text
.
├─ apps/
│  ├─ api/                 # NestJS API 服务
│  └─ web/                 # Next.js 后台
├─ docs/                   # 中文设计与部署文档
├─ infra/sql/init/         # PostgreSQL 初始化脚本
├─ packages/               # 预留共享包
├─ docker-compose.yml
└─ README.md
```

## 快速开始

1. 安装依赖

```bash
pnpm install
```

2. 复制环境变量

```bash
cp .env.example .env
```

3. 启动基础服务

```bash
docker compose up -d postgres redis
```

4. 初始化数据库

```bash
pnpm db:generate
pnpm --filter api exec prisma migrate dev --name init
pnpm db:seed
```

5. 启动开发环境

```bash
docker compose up -d
```

## 默认地址

- API：`http://localhost:3000`
- Swagger：`http://localhost:3000/docs`
- Web：`http://localhost:3001`

## 默认演示账号

- 管理员账号：`admin`
- 管理员密码：`Admin@123456`
- 演示商户 PID：`1000001`
- 演示商户 KEY：`demo_merchant_key_please_change`

上线前请务必修改默认密码、商户密钥和通道证书配置。

## NewAPI 接入说明

`sk-epay` 默认不使用 `.php` 风格路径，但保持 EPay 参数格式与签名规则兼容。

推荐配置：

- 网关地址：`https://你的域名/api/pay`
- 商户 PID：你的商户 PID
- 商户 KEY：你的商户 KEY
- 签名算法：`MD5`

更多示例见：

- [架构说明](./docs/architecture.zh-CN.md)
- [NewAPI 配置示例](./docs/newapi-config.zh-CN.md)
- [部署说明](./docs/deploy.zh-CN.md)

## 当前进度

当前已完成：

- Monorepo 基础结构
- NestJS / Next.js / Prisma 官方脚手架初始化
- 支付域核心 Prisma 模型
- EPay 风格签名与基础网关控制器
- 管理后台首页、商户页、订单页、通道页骨架

当前待继续：

- 微信支付官方 V3 直连
- 支付宝开放平台直连
- 商户与管理员认证体系
- BullMQ 通知重试、防重放与补单任务
- 退款、对账、分账完整流程

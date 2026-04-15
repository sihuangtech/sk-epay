# sk-epay 架构设计说明

## 1. 项目命名建议

- 项目 ID：`sk-epay`
- 对外兼容标识建议：`EPay Compatible Gateway`

## 2. 总体架构

项目采用 `Turborepo Monorepo` 组织，前后端完全分离，但共享类型、SDK 与校验模型。

```text
sk-epay
├─ apps/
│  ├─ api/                 # NestJS 后端
│  └─ web/                 # Next.js 运营后台 + 商户后台
├─ packages/
│  ├─ shared/              # 通用类型、枚举、Zod 模型
│  ├─ epay-sdk/            # EPay 协议兼容层
│  └─ ui/                  # shadcn/ui 二次封装
├─ infra/
│  ├─ sql/                 # 初始化 SQL / 索引 / 函数
│  └─ docker/              # 镜像脚本与部署材料
└─ docs/                   # 中文设计文档
```

## 3. 技术栈选择理由

### 后端：NestJS 10+ + Node.js 20+

- 适合支付系统复杂分层，天然支持模块化、依赖注入、守卫、拦截器与任务调度。
- TypeScript 类型系统更适合做支付协议兼容、签名参数校验、渠道抽象。
- Node.js 20 LTS 在 WebCrypto、性能与容器环境上足够成熟。

### 前端：Next.js 15 + React 19 + Tailwind + shadcn/ui

- App Router 适合后台系统按业务域拆分页面与布局。
- React 19 的服务端/客户端协作更清晰，适合表格、仪表盘、配置页混合场景。
- Tailwind + shadcn/ui 能快速做出企业后台，同时保持可维护性与一致性。

### 数据层：PostgreSQL 16 + Prisma

- PostgreSQL 适合事务、唯一索引、支付订单状态流转、复杂查询与对账。
- Prisma 开发效率高，类型推导稳定，适合快速搭建企业级支付后台。

### 缓存与异步：Redis + BullMQ

- Redis 用于幂等锁、回调去重、会话缓存、风控频次控制。
- BullMQ 适合支付通知重试、补单、对账拉取、延迟任务。

## 4. 业务分层

后端按企业级分层组织：

- `controller`：HTTP 入口，处理 EPay 协议接口与后台接口。
- `application/service`：业务编排，如下单、回调、退款、补单。
- `domain`：订单聚合、状态机、签名规则、渠道路由规则。
- `repository`：Prisma 数据访问封装。
- `infra`：微信支付、支付宝、Redis、BullMQ、日志、加密实现。

## 5. 核心模块划分

- `auth`：管理员 / 商户登录，JWT 或 Lucia 会话。
- `merchant`：商户资料、PID/KEY、费率、白名单、状态。
- `channel`：支付通道配置、证书、私钥、APIv3 Key、路由开关。
- `epay`：标准易支付兼容协议层，主接口使用 `/api/pay`、`/api/query`、`/api/notify`、`/api/return`。
- `order`：统一下单、状态流转、查询、退款、补单。
- `notify`：异步通知、同步返回、重试、防重放、签名校验。
- `reconciliation`：对账与差异标记。
- `settlement`：分账基础能力与结算记录。

## 6. 为什么能兼容 NewAPI

兼容策略基于“协议不动、内部实现替换”：

- 保留标准易支付参数命名与签名规则，但接口路径采用现代 REST 风格。
- 使用 MD5 字典序签名规则：过滤空值与 `sign/sign_type` 后拼接 `key=value`，末尾追加商户 `key`。
- 保持 `pid`、`type`、`notify_url`、`return_url`、`out_trade_no`、`name`、`money` 等经典字段。
- 响应结构尽量与彩虹易支付兼容，确保 NewAPI 仅需填写网关地址、PID、KEY 即可联通。

## 7. 安全设计

- 所有支付回调落库前先做幂等校验与签名校验。
- 使用 Redis 锁避免重复处理通知。
- 核心订单更新走数据库事务，防止并发覆盖。
- 渠道私钥、证书、APIv3 Key 建议二次加密存储。
- 支持回调重试日志、请求日志、原始报文留档，便于审计。

## 8. 推荐实施顺序

1. 完成基础容器、数据库与工作区。
2. 完成 Prisma 数据模型。
3. 完成 NestJS 基础模块与 EPay 协议兼容层。
4. 完成微信/支付宝直连抽象与路由。
5. 完成后台前端页面。
6. 完成通知重试、对账、补单与部署文档。

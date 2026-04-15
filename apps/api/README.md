# sk-epay API

`apps/api` 是 `sk-epay` 的后端服务，基于 `NestJS 11` 构建，负责商户、订单、通道、签名校验和 EPay / NewAPI 风格网关协议处理。

## 当前接口

- 下单：`GET/POST /api/pay`
- 查询：`GET/POST /api/query`
- 异步通知：`GET/POST /api/notify`
- 同步返回：`GET /api/return`
- 健康检查：`GET /`
- Swagger：`GET /docs`

## 开发命令

```bash
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api test
```

## 数据库命令

```bash
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev --name init
pnpm --filter api exec prisma db seed
```

## 当前模块

- `prisma`：Prisma 客户端与数据库接入
- `modules/merchant`：商户读取与校验
- `modules/order`：订单创建与状态更新
- `modules/epay`：MD5 签名、统一下单、查询、通知、返回页

## 后续待补

- 微信支付官方 V3
- 支付宝开放平台直连
- 管理员 / 商户 JWT 鉴权
- BullMQ 通知重试与补单
- 退款、对账、分账执行链路

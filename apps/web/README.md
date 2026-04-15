# sk-epay Web

`apps/web` 是 `sk-epay` 的管理后台，基于 `Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui` 构建。

## 当前页面

- `/`：控制台首页
- `/merchants`：商户管理骨架页
- `/orders`：订单中心骨架页
- `/channels`：支付通道骨架页

## 开发命令

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

## 设计原则

- 默认使用中文后台文案
- 页面路径现代化，不使用 `.php`
- 保持和后端 `api` 服务的接口契约一致
- 组件基于 `shadcn/ui`，方便后续扩展表单和表格

## 后续待补

- 登录页与权限体系
- 商户、订单、通道真实 CRUD
- 退款、补单、对账视图
- 通道证书与密钥配置表单

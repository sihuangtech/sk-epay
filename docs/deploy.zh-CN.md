# sk-epay 部署说明

## 1. 初始化环境

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres redis
```

## 2. 初始化数据库

```bash
pnpm db:generate
pnpm --filter api exec prisma migrate dev --name init
pnpm db:seed
```

## 3. 启动开发环境

```bash
docker compose up -d
```

默认端口：

- API：`http://localhost:3000`
- Swagger：`http://localhost:3000/docs`
- Web：`http://localhost:3001`

## 4. 首次登录

- 管理员账号：`admin`
- 管理员密码：`Admin@123456`
- 演示商户 PID：`1000001`
- 演示商户 KEY：`demo_merchant_key_please_change`

上线前必须修改默认口令与密钥。

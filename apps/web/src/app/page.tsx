import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHealth } from "@/lib/api";

const metrics = [
  { label: "EPay 兼容入口", value: "/submit.php /api/pay" },
  { label: "订单查询", value: "/query.php" },
  { label: "回调处理", value: "/notify.php /return.php" },
  { label: "官方直连", value: "微信支付 / 支付宝" },
];

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(214,241,236,0.9),_transparent_45%),linear-gradient(180deg,#f6f6ef_0%,#fbfaf7_55%,#f1efe6_100%)] px-6 py-10 text-stone-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-stone-300/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(40,40,20,0.08)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <Badge className="rounded-full bg-emerald-700 px-3 py-1 text-white">
                sk-epay 控制台
              </Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">
                  标准易支付兼容网关
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-stone-600">
                  面向 NewAPI 与多商户场景，统一承接 EPay 协议入口、官方微信支付/支付宝直连、订单通知、对账和后台管理。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/merchants">
                <Button className="rounded-full bg-stone-900 px-5 text-white">
                  商户管理
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="rounded-full">
                  订单中心
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
            <Card key={item.label} className="border-stone-200/80 bg-white/85">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-stone-500">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-stone-200/80 bg-white/90">
            <CardHeader>
              <CardTitle>接入摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-stone-600">
              <p>1. NewAPI 仅需填写网关地址、商户 PID、商户 KEY 即可直连。</p>
              <p>2. EPay 协议层保持经典字段和 MD5 字典序签名规则不变。</p>
              <p>3. 内部路由可再转到官方微信支付或支付宝商户直连通道。</p>
              <p>4. 后续页面会继续补订单、通道、退款、对账和补单工作流。</p>
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-stone-950 text-stone-100">
            <CardHeader>
              <CardTitle>API 状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>服务名：{health?.name ?? "未连接"}</p>
              <p>状态：{health?.status ?? "unknown"}</p>
              <p>时间：{health?.timestamp ?? "等待 API 启动"}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMerchants } from "@/lib/api";

export default async function MerchantPage() {
  const response = await getMerchants();
  const rows = response?.items ?? [];

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">商户管理</h1>
          <p className="text-sm text-stone-500">
            用于生成 PID / KEY、管理支付类型、回调重试策略和官方直连通道绑定。
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>搜索商户</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="输入商户名称、PID 或联系人" />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((item) => (
            <Card key={item.pid}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <Badge variant="outline">{item.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-stone-600">
                <p>PID：{item.pid}</p>
                <p>支付类型：{item.allowedPaymentTypes.join(" / ") || "未配置"}</p>
                <p>创建时间：{new Date(item.createdAt).toLocaleString("zh-CN")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

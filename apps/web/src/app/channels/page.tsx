import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChannels } from "@/lib/api";

export default async function ChannelsPage() {
  const response = await getChannels();
  const channels = response?.items ?? [];

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">支付通道</h1>
          <p className="text-sm text-stone-500">
            通道页面用于管理官方支付宝、微信支付和后续扩展渠道的路由配置。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-stone-600">
                <p>编码：{item.code}</p>
                <p>提供方：{item.provider}</p>
                <p>支付类型：{item.supportedTypes.join(" / ")}</p>
                <p>模式：{item.supportedModes.join(" / ")}</p>
                <p>状态：{item.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

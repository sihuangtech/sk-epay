import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders } from "@/lib/api";

export default async function OrdersPage() {
  const response = await getOrders();
  const orders = response?.items ?? [];

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">订单中心</h1>
          <p className="text-sm text-stone-500">
            后续这里会承接退款、补单、回调日志、防重放日志和对账差异处理。
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>平台单号</TableHead>
                <TableHead>商户单号</TableHead>
                <TableHead>商户</TableHead>
                <TableHead>支付类型</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.tradeNo}</TableCell>
                  <TableCell>{row.merchantTradeNo}</TableCell>
                  <TableCell>{row.merchantName}</TableCell>
                  <TableCell>{row.paymentType}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "SUCCESS" ? "default" : "secondary"}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

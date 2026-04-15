import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('admin/orders')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async list(@Query('keyword') keyword?: string) {
    const orders = await this.orderService.list(keyword);

    return {
      items: orders.map((order) => ({
        id: order.id,
        tradeNo: order.epayTradeNo,
        merchantTradeNo: order.merchantTradeNo,
        merchantName: order.merchant.name,
        paymentType: order.paymentType,
        amount: order.amount.toString(),
        status: order.status,
        createdAt: order.createdAt,
      })),
    };
  }
}

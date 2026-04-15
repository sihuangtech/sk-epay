import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentType, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';

type CreateOrderInput = {
  merchantId: string;
  channelId?: string;
  bindingId?: string;
  epayTradeNo?: string;
  merchantTradeNo: string;
  paymentType: PaymentType;
  subject: string;
  body?: string;
  amount: number;
  notifyUrl: string;
  returnUrl?: string;
  clientIp?: string;
  device?: string;
};

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  previewTradeNo() {
    return this.buildTradeNo();
  }

  list(keyword?: string) {
    const normalizedKeyword = keyword?.trim();

    return this.prisma.paymentOrder.findMany({
      where: normalizedKeyword
        ? {
            OR: [
              { epayTradeNo: { contains: normalizedKeyword, mode: 'insensitive' } },
              { merchantTradeNo: { contains: normalizedKeyword, mode: 'insensitive' } },
              { merchant: { name: { contains: normalizedKeyword, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      include: { merchant: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async createOrder(input: CreateOrderInput) {
    return this.prisma.paymentOrder.create({
      data: {
        merchantId: input.merchantId,
        channelId: input.channelId,
        bindingId: input.bindingId,
        epayTradeNo: input.epayTradeNo ?? this.buildTradeNo(),
        merchantTradeNo: input.merchantTradeNo,
        paymentType: input.paymentType,
        subject: input.subject,
        body: input.body,
        amount: new Prisma.Decimal(input.amount.toFixed(2)),
        notifyUrl: input.notifyUrl,
        returnUrl: input.returnUrl,
        clientIp: input.clientIp,
        device: input.device,
        expiredAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
  }

  findByTradeNo(tradeNo: string) {
    return this.prisma.paymentOrder.findUnique({
      where: { epayTradeNo: tradeNo },
      include: { merchant: true },
    });
  }

  findByMerchantTradeNo(merchantId: string, merchantTradeNo: string) {
    return this.prisma.paymentOrder.findUnique({
      where: {
        merchantId_merchantTradeNo: {
          merchantId,
          merchantTradeNo,
        },
      },
      include: { merchant: true },
    });
  }

  async markOrderSuccess(orderId: string, providerTradeNo?: string, payload?: Prisma.InputJsonValue) {
    return this.prisma.paymentOrder.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.SUCCESS,
        providerTradeNo,
        providerPayload: payload,
        paidAt: new Date(),
      },
    });
  }

  private buildTradeNo() {
    return `MEP${Date.now()}${randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`;
  }
}

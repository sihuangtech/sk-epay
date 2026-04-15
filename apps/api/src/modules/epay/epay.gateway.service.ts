import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentType } from '@prisma/client';
import { MerchantService } from '../merchant/merchant.service';
import { OrderService } from '../order/order.service';
import { EpaySignatureService } from './epay.signature.service';
import { ProviderRouterService } from './provider-router.service';

type RawParams = Record<string, string | undefined>;

@Injectable()
export class EpayGatewayService {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly orderService: OrderService,
    private readonly signatureService: EpaySignatureService,
    private readonly providerRouterService: ProviderRouterService,
  ) {}

  async submit(rawParams: RawParams, clientIp?: string) {
    const merchant = await this.merchantService.requireActiveMerchant(rawParams.pid ?? '');
    this.assertSignature(rawParams, merchant.apiKey);

    const paymentType = this.mapPaymentType(rawParams.type);
    const amount = Number(rawParams.money ?? 0);
    const tradeNo = this.orderService.previewTradeNo();
    const providerResult = await this.providerRouterService.submit({
      merchantId: merchant.id,
      merchantName: merchant.name,
      paymentType,
      tradeNo,
      merchantTradeNo: rawParams.out_trade_no ?? '',
      subject: rawParams.name ?? '聚合支付订单',
      body: rawParams.body,
      amount: amount.toFixed(2),
      notifyUrl: rawParams.notify_url ?? '',
      returnUrl: rawParams.return_url,
      clientIp,
    });

    const order = await this.orderService.createOrder({
      merchantId: merchant.id,
      channelId: providerResult?.channelId,
      bindingId: providerResult?.bindingId,
      epayTradeNo: tradeNo,
      merchantTradeNo: rawParams.out_trade_no ?? '',
      paymentType,
      subject: rawParams.name ?? '聚合支付订单',
      body: rawParams.body,
      amount,
      notifyUrl: rawParams.notify_url ?? '',
      returnUrl: rawParams.return_url,
      clientIp,
      device: rawParams.device,
    });

    return {
      code: 1,
      msg: 'success',
      trade_no: order.epayTradeNo,
      out_trade_no: order.merchantTradeNo,
      type: rawParams.type,
      payurl: providerResult?.payUrl ?? `${process.env.API_BASE_URL}/cashier/${order.epayTradeNo}`,
      qrcode: providerResult?.qrCode ?? '',
      channel: providerResult?.provider ?? 'INTERNAL_CASHIER',
    };
  }

  async query(rawParams: RawParams) {
    const merchant = await this.merchantService.requireActiveMerchant(rawParams.pid ?? '');
    this.assertSignature(rawParams, merchant.apiKey);

    const order = rawParams.trade_no
      ? await this.orderService.findByTradeNo(rawParams.trade_no)
      : await this.orderService.findByMerchantTradeNo(merchant.id, rawParams.out_trade_no ?? '');

    if (!order) {
      return { code: -1, msg: '订单不存在' };
    }

    return {
      code: 1,
      msg: 'success',
      trade_no: order.epayTradeNo,
      out_trade_no: order.merchantTradeNo,
      type: order.paymentType.toLowerCase(),
      money: order.amount.toString(),
      status: this.mapOrderStatus(order.status),
      endtime: order.paidAt?.toISOString() ?? null,
    };
  }

  async notify(rawParams: RawParams) {
    const merchant = await this.merchantService.requireActiveMerchant(rawParams.pid ?? '');
    this.assertSignature(rawParams, merchant.apiKey);

    const order = await this.orderService.findByTradeNo(rawParams.trade_no ?? '');
    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== OrderStatus.SUCCESS) {
      await this.orderService.markOrderSuccess(order.id, rawParams.provider_trade_no, rawParams);
    }

    return 'success';
  }

  private assertSignature(rawParams: RawParams, apiKey: string) {
    const passed = this.signatureService.verify(rawParams, apiKey, rawParams.sign);
    if (!passed) {
      throw new Error('签名校验失败');
    }
  }

  private mapPaymentType(type?: string) {
    switch ((type ?? '').toLowerCase()) {
      case 'alipay':
        return PaymentType.ALIPAY;
      case 'wxpay':
        return PaymentType.WXPAY;
      case 'qqpay':
        return PaymentType.QQPAY;
      case 'bank':
        return PaymentType.BANK;
      default:
        throw new Error(`不支持的支付类型: ${type ?? 'empty'}`);
    }
  }

  private mapOrderStatus(status: OrderStatus) {
    return status === OrderStatus.SUCCESS ? 1 : 0;
  }
}

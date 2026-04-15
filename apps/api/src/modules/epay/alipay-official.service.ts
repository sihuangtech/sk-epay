import { Injectable } from '@nestjs/common';
import { AlipaySdk } from 'alipay-sdk';
import { ChannelMode, ChannelProvider, MerchantChannelBinding, PaymentChannel } from '@prisma/client';
import { ProviderSubmitResult, SubmitContext } from './epay.types';

type AlipayCredentialConfig = {
  appId?: string;
  privateKeyPem?: string;
  alipayPublicKey?: string;
  gateway?: string;
};

@Injectable()
export class AlipayOfficialService {
  async createPayment(
    binding: MerchantChannelBinding & { channel: PaymentChannel },
    context: SubmitContext,
  ): Promise<ProviderSubmitResult> {
    const credential = binding.credentialConfig as AlipayCredentialConfig;
    if (!credential.appId || !credential.privateKeyPem || !credential.alipayPublicKey) {
      throw new Error('支付宝官方通道配置不完整');
    }

    const client = new AlipaySdk({
      appId: credential.appId,
      privateKey: credential.privateKeyPem,
      alipayPublicKey: credential.alipayPublicKey,
      endpoint: credential.gateway,
    });

    const payUrl = await client.pageExecute('alipay.trade.wap.pay', 'GET', {
      notifyUrl: context.notifyUrl,
      returnUrl: context.returnUrl,
      bizContent: {
        out_trade_no: context.tradeNo,
        subject: context.subject,
        body: context.body,
        total_amount: context.amount,
        product_code: 'QUICK_WAP_WAY',
      },
    });

    return {
      provider: ChannelProvider.ALIPAY_OFFICIAL,
      mode: ChannelMode.H5,
      channelId: binding.channelId,
      bindingId: binding.id,
      payUrl,
      providerPayload: {
        gateway: credential.gateway ?? 'https://openapi.alipay.com',
      },
    };
  }
}

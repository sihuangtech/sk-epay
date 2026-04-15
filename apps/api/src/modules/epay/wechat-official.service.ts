import { Injectable } from '@nestjs/common';
import { createPrivateKey, createSign, randomUUID } from 'node:crypto';
import { ChannelMode, ChannelProvider, MerchantChannelBinding, PaymentChannel } from '@prisma/client';
import { ProviderSubmitResult, SubmitContext } from './epay.types';

type WechatChannelConfig = {
  mchId?: string;
  apiV3Key?: string;
  certSerialNo?: string;
  gateway?: string;
};

type WechatCredentialConfig = {
  appId?: string;
  privateKeyPem?: string;
};

@Injectable()
export class WechatOfficialService {
  async createPayment(
    binding: MerchantChannelBinding & { channel: PaymentChannel },
    context: SubmitContext,
  ): Promise<ProviderSubmitResult> {
    const channelConfig = binding.channel.config as WechatChannelConfig;
    const credential = binding.credentialConfig as WechatCredentialConfig;
    if (!channelConfig.mchId || !channelConfig.certSerialNo || !credential.appId || !credential.privateKeyPem) {
      throw new Error('微信支付官方通道配置不完整');
    }

    const path = '/v3/pay/transactions/native';
    const body = {
      appid: credential.appId,
      mchid: channelConfig.mchId,
      description: context.subject,
      out_trade_no: context.tradeNo,
      notify_url: context.notifyUrl,
      amount: {
        total: Math.round(Number(context.amount) * 100),
        currency: 'CNY',
      },
    };

    const gateway = channelConfig.gateway ?? 'https://api.mch.weixin.qq.com';
    const response = await fetch(`${gateway}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.buildAuthorization(
          'POST',
          path,
          JSON.stringify(body),
          channelConfig.mchId,
          channelConfig.certSerialNo,
          credential.privateKeyPem,
        ),
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      throw new Error(`微信支付下单失败: ${JSON.stringify(payload)}`);
    }

    return {
      provider: ChannelProvider.WECHAT_OFFICIAL,
      mode: ChannelMode.NATIVE,
      channelId: binding.channelId,
      bindingId: binding.id,
      qrCode: String(payload.code_url ?? ''),
      providerTradeNo: String(payload.prepay_id ?? ''),
      providerPayload: payload,
    };
  }

  private buildAuthorization(
    method: string,
    path: string,
    body: string,
    mchId: string,
    serialNo: string,
    privateKeyPem: string,
  ) {
    const nonce = randomUUID().replace(/-/g, '');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const message = `${method}\n${path}\n${timestamp}\n${nonce}\n${body}\n`;
    const signer = createSign('RSA-SHA256');
    signer.update(message);
    signer.end();
    const signature = signer.sign(createPrivateKey(privateKeyPem), 'base64');

    return `WECHATPAY2-SHA256-RSA2048 mchid="${mchId}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${serialNo}",signature="${signature}"`;
  }
}

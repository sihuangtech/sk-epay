import { ChannelMode, ChannelProvider, PaymentType } from '@prisma/client';

export type SubmitContext = {
  merchantId: string;
  merchantName: string;
  paymentType: PaymentType;
  tradeNo: string;
  merchantTradeNo: string;
  subject: string;
  body?: string;
  amount: string;
  notifyUrl: string;
  returnUrl?: string;
  clientIp?: string;
};

export type ProviderSubmitResult = {
  provider: ChannelProvider;
  mode: ChannelMode;
  channelId: string;
  bindingId: string;
  payUrl?: string;
  qrCode?: string;
  providerTradeNo?: string;
  providerPayload?: Record<string, unknown>;
};

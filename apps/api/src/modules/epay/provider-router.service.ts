import { Injectable } from '@nestjs/common';
import { ChannelProvider } from '@prisma/client';
import { ChannelService } from '../channel/channel.service';
import { ProviderSubmitResult, SubmitContext } from './epay.types';
import { AlipayOfficialService } from './alipay-official.service';
import { WechatOfficialService } from './wechat-official.service';

@Injectable()
export class ProviderRouterService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly alipayOfficialService: AlipayOfficialService,
    private readonly wechatOfficialService: WechatOfficialService,
  ) {}

  async submit(context: SubmitContext): Promise<ProviderSubmitResult | null> {
    const binding = await this.channelService.resolveBestBinding(context.merchantId, context.paymentType);
    if (!binding || !this.channelService.isOfficialProvider(binding.channel.provider)) {
      return null;
    }

    switch (binding.channel.provider) {
      case ChannelProvider.ALIPAY_OFFICIAL:
        return this.alipayOfficialService.createPayment(binding, context);
      case ChannelProvider.WECHAT_OFFICIAL:
        return this.wechatOfficialService.createPayment(binding, context);
      default:
        return null;
    }
  }
}

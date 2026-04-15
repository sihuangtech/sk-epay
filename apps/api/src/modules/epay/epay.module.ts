import { Module } from '@nestjs/common';
import { ChannelModule } from '../channel/channel.module';
import { MerchantModule } from '../merchant/merchant.module';
import { OrderModule } from '../order/order.module';
import { AlipayOfficialService } from './alipay-official.service';
import { EpayController } from './epay.controller';
import { EpayGatewayService } from './epay.gateway.service';
import { EpaySignatureService } from './epay.signature.service';
import { ProviderRouterService } from './provider-router.service';
import { WechatOfficialService } from './wechat-official.service';

@Module({
  imports: [MerchantModule, OrderModule, ChannelModule],
  controllers: [EpayController],
  providers: [
    EpaySignatureService,
    EpayGatewayService,
    ProviderRouterService,
    AlipayOfficialService,
    WechatOfficialService,
  ],
})
export class EpayModule {}

import { Injectable } from '@nestjs/common';
import { ChannelProvider, ChannelStatus, PaymentType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.paymentChannel.findMany({
      orderBy: [{ routePriority: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async resolveBestBinding(merchantId: string, paymentType: PaymentType) {
    const bindings = await this.prisma.merchantChannelBinding.findMany({
      where: {
        merchantId,
        status: ChannelStatus.ENABLED,
        channel: {
          status: ChannelStatus.ENABLED,
          supportedTypes: {
            has: paymentType,
          },
        },
      },
      include: {
        channel: true,
      },
      orderBy: [{ routeWeight: 'desc' }, { channel: { routePriority: 'asc' } }],
    });

    return bindings[0] ?? null;
  }

  isOfficialProvider(provider: ChannelProvider) {
    return [ChannelProvider.ALIPAY_OFFICIAL, ChannelProvider.WECHAT_OFFICIAL].includes(provider);
  }
}

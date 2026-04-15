import { Controller, Get, Query } from '@nestjs/common';
import { MerchantService } from './merchant.service';

@Controller('admin/merchants')
export class MerchantAdminController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get()
  async list(@Query('keyword') keyword?: string) {
    const merchants = await this.merchantService.list(keyword);

    return {
      items: merchants.map((merchant) => ({
        id: merchant.id,
        name: merchant.name,
        pid: merchant.pid,
        status: merchant.status,
        allowedPaymentTypes: merchant.allowedPaymentTypes,
        createdAt: merchant.createdAt,
      })),
    };
  }
}

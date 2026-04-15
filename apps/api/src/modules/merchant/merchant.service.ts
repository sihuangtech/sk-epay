import { Injectable } from '@nestjs/common';
import { Merchant, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MerchantService {
  constructor(private readonly prisma: PrismaService) {}

  list(keyword?: string) {
    const normalizedKeyword = keyword?.trim();

    return this.prisma.merchant.findMany({
      where: normalizedKeyword
        ? {
            OR: [
              { name: { contains: normalizedKeyword, mode: 'insensitive' } },
              { pid: { contains: normalizedKeyword, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  findByPid(pid: string): Promise<Merchant | null> {
    return this.prisma.merchant.findUnique({
      where: { pid },
    });
  }

  async requireActiveMerchant(pid: string): Promise<Merchant> {
    const merchant = await this.findByPid(pid);

    if (!merchant || merchant.status !== UserStatus.ACTIVE) {
      throw new Error('商户不存在或已禁用');
    }

    return merchant;
  }
}

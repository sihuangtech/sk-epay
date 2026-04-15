import { Controller, Get } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('admin/channels')
export class ChannelAdminController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async list() {
    const channels = await this.channelService.list();

    return {
      items: channels.map((channel) => ({
        id: channel.id,
        code: channel.code,
        name: channel.name,
        provider: channel.provider,
        supportedTypes: channel.supportedTypes,
        supportedModes: channel.supportedModes,
        status: channel.status,
        routePriority: channel.routePriority,
        createdAt: channel.createdAt,
      })),
    };
  }
}

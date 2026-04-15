import { Module } from '@nestjs/common';
import { ChannelAdminController } from './channel.admin.controller';
import { ChannelService } from './channel.service';

@Module({
  controllers: [ChannelAdminController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}

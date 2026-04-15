import { Module } from '@nestjs/common';
import { OrderAdminController } from './order.admin.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderAdminController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

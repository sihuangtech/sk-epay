import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { EpayGatewayService } from './epay.gateway.service';

@Controller()
export class EpayController {
  constructor(private readonly epayGatewayService: EpayGatewayService) {}

  @Get('api/pay')
  async submitByGet(@Query() query: Record<string, string>, @Req() req: Request, @Res() res: Response) {
    return this.respondSubmit(query, req, res);
  }

  @Post('api/pay')
  async submitByPost(@Body() body: Record<string, string>, @Req() req: Request, @Res() res: Response) {
    return this.respondSubmit(body, req, res);
  }

  @Get('api/query')
  queryByGet(@Query() query: Record<string, string>) {
    return this.epayGatewayService.query(query);
  }

  @Post('api/query')
  queryByPost(@Body() body: Record<string, string>) {
    return this.epayGatewayService.query(body);
  }

  @Get('api/notify')
  notifyByGet(@Query() query: Record<string, string>) {
    return this.epayGatewayService.notify(query);
  }

  @Post('api/notify')
  notifyByPost(@Body() body: Record<string, string>) {
    return this.epayGatewayService.notify(body);
  }

  @Get('api/return')
  async returnPage(@Query('trade_no') tradeNo: string, @Res() res: Response) {
    res.type('html').send(
      `<html><body><h1>支付结果返回</h1><p>订单号：${tradeNo}</p><p>请按业务需要跳转商户 return_url。</p></body></html>`,
    );
  }

  private async respondSubmit(
    params: Record<string, string>,
    req: Request,
    res: Response,
  ) {
    const result = await this.epayGatewayService.submit(params, req.ip);
    const format = (params.format ?? params.return_type ?? 'json').toLowerCase();

    if (format === 'json' || req.path === '/api/pay') {
      return res.json(result);
    }

    return res.redirect(result.payurl);
  }
}

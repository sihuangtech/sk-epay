import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

type SignParams = Record<string, string | number | boolean | null | undefined>;

@Injectable()
export class EpaySignatureService {
  buildSign(params: SignParams, key: string) {
    const content = this.buildSignContent(params);
    return createHash('md5').update(`${content}${key}`, 'utf8').digest('hex');
  }

  verify(params: SignParams, key: string, sign?: string) {
    if (!sign) {
      return false;
    }

    return this.buildSign(params, key) === sign.toLowerCase();
  }

  private buildSignContent(params: SignParams) {
    return Object.keys(params)
      .filter((field) => !['sign', 'sign_type'].includes(field))
      .filter((field) => params[field] !== '' && params[field] !== null && params[field] !== undefined)
      .sort()
      .map((field) => `${field}=${String(params[field])}`)
      .join('&');
  }
}

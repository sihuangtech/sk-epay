import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'sk-epay API',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

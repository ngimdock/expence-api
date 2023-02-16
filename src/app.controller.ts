import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from './auth/decorators';
import { name, version } from 'package.json';

@PublicRoute()
@Controller()
export class AppController {
  @Get('/status')
  getStatus() {
    return {
      name,
      version,
    };
  }
}

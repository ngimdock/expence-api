import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule, AuthModule],
})
export class AppModule {}

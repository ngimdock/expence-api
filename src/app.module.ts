import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [PrismaModule, AuthModule, UserModule],
})
export class AppModule {}

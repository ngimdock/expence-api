import { CacheModule, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { SessionGuard } from './auth/guards';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Global()
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ExpenseModule,

    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,

      useFactory: (configService: ConfigService): any => {
        return {
          store: redisStore,
          url: configService.getOrThrow('REDIS_URL'),
        };
      },

      imports: [ConfigModule],
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
})
export class AppModule {}

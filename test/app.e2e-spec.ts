import { Test } from '@nestjs/testing';
import { CacheModule, CACHE_MANAGER, INestApplication } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ExpenseModule } from 'src/expense/expense.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from 'src/scheduler/sheduler.module';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard, SessionGuard } from 'src/auth/guards';
import * as redisStore from 'cache-manager-redis-store';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AuthModule,
        UserModule,
        ExpenseModule,
        ScheduleModule.forRoot(),
        SchedulerModule,
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
        {
          provide: APP_GUARD,
          useClass: AdminGuard,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // close the connexion to redis
    const cache = app.get(CACHE_MANAGER);

    const cacheClient = cache.store.getClient();

    await cacheClient.quit();

    app.close();
  });

  describe('AppModule', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });
});

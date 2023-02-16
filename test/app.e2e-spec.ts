import { Test } from '@nestjs/testing';
import {
  CacheModule,
  CACHE_MANAGER,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ExpenseModule } from 'src/expense/expense.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from 'src/scheduler/sheduler.module';
import { RedisClientOptions, RedisClientType } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard, SessionGuard } from 'src/auth/guards';
import * as redisStore from 'cache-manager-redis-store';
import * as request from 'supertest';
import { AuthDto } from 'src/auth/dtos';
import * as session from 'express-session';
import { createClient } from 'redis';
import * as connectRedis from 'connect-redis';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from 'src/expense/dtos';

describe('App E2E', () => {
  let app: INestApplication;
  let redisClient: RedisClientType;
  let cookie = '';

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

    const configService = app.get(ConfigService);

    const prisma = app.get(PrismaService);

    // redis connection logic
    const RedisStore = connectRedis(session);
    redisClient = createClient({
      url: configService.getOrThrow('REDIS_URL'),
      legacyMode: true,
    });

    app.use(
      session({
        secret: configService.getOrThrow('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({
          client: redisClient,
        }),
      }),
    );

    await redisClient.connect().catch((err) => {
      throw err;
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );

    await app.init();

    await prisma.cleanDb();
  });

  afterAll(async () => {
    const cache = app.get(CACHE_MANAGER);

    const cacheClient: RedisClientType = cache.store.getClient();

    // close the connexion to redis cache and redis session
    await cacheClient.quit();
    await redisClient.disconnect();

    app.close();
  });

  describe('AppModule', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    describe('Auth', () => {
      const authDto: AuthDto = {
        email: 'ngimdock@gmail.com',
        password: '000000',
      };

      describe('Register', () => {
        it('should register', async () => {
          return request(app.getHttpServer())
            .post('/auth/register')
            .send(authDto)
            .expect('set-cookie', /connect.sid/) // check if cookie is set
            .expect(HttpStatus.CREATED)
            .expect(({ headers }) => {
              cookie = headers?.['set-cookie'];
            });
        });
      });

      describe('Login', () => {
        it('should login', async () => {
          return request(app.getHttpServer())
            .post('/auth/login')
            .send(authDto)
            .expect('set-cookie', /connect.sid/) // check if the cookie is set
            .expect(HttpStatus.OK)
            .expect(({ headers }) => {
              cookie = headers?.['set-cookie'];
            });
        });
      });

      describe('User profile', () => {
        it('should get user profile', () => {
          return request(app.getHttpServer())
            .get('/user/me')
            .set('Cookie', cookie)
            .expect(HttpStatus.OK)
            .expect(({ body }) => {
              console.log({ me: body });
            });
        });
      });
    });

    describe('Expense', () => {
      let expenseId: number;

      it('should create 2 expenses', async () => {
        const expenseDto1: CreateExpenseDto = {
          title: 'First expense',
          amount: '100',
          date: new Date(),
          description: 'description of the first expense',
        };

        const expenseDto2: CreateExpenseDto = {
          title: 'second expense',
          amount: '50',
          date: new Date(),
          description: 'description of the second expense',
        };

        await request(app.getHttpServer())
          .post(`/expense/create`)
          .set('Cookie', cookie)
          .send(expenseDto1)
          .expect(HttpStatus.CREATED)
          .expect(({ body }) => {
            console.log({ body });
          });

        await request(app.getHttpServer())
          .post(`/expense/create`)
          .set('Cookie', cookie)
          .send(expenseDto2)
          .expect(HttpStatus.CREATED);
      });

      it('should get all expenses', () => {
        return request(app.getHttpServer())
          .get('/expense')
          .set('Cookie', cookie)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.any(Array),
                count: 2,
                hasMore: false,
              }),
            );

            expenseId = body?.data[0]?.id;
          });
      });

      it('should get expense by id', async () => {
        await request(app.getHttpServer()) // get expense with id that not exist
          .get(`/expense/${0}`)
          .set('Cookie', cookie)
          .expect(HttpStatus.NOT_FOUND)
          .expect(({ body }) => {
            expect(body.message).toEqual('Resource does not exist');
          });

        await request(app.getHttpServer())
          .get(`/expense/${expenseId}`)
          .set('Cookie', cookie)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body).toBeTruthy();
          });
      });

      it('should update expense by id', () => {
        const updateExpenseDto: UpdateExpenseDto = {
          description: 'updated description',
        };

        return request(app.getHttpServer())
          .patch(`/expense/update/${expenseId}`)
          .set('Cookie', cookie)
          .send(updateExpenseDto)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.description).toEqual(updateExpenseDto.description);
          });
      });

      it('should delete expense by id', async () => {
        await request(app.getHttpServer())
          .delete(`/expense/${expenseId}`)
          .set('Cookie', cookie)
          .expect(HttpStatus.NO_CONTENT);

        await request(app.getHttpServer())
          .get(`/expense/${expenseId}`)
          .set('Cookie', cookie)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});

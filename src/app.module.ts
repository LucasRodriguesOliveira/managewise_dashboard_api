import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { envConfig } from './config/env/env.config';
import { throttlerConfig } from './config/throttler.config';
import { UserTypeModule } from './module/user-type/user-type.module';
import { PrismaModule } from './prisma/prisma.module';
import { PermissionModule } from './module/permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    PrismaModule,
    UserTypeModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

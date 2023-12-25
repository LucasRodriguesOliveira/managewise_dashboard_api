import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { envConfig } from './config/env/env.config';
import { throttlerConfig } from './config/throttler.config';
import { PermissionGroupModule } from './module/permission-group/permission-group.module';
import { PermissionModule } from './module/permission/permission.module';
import { UserTypeModule } from './module/user-type/user-type.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    ThrottlerModule.forRoot(throttlerConfig),
    PrismaModule,
    UserTypeModule,
    PermissionModule,
    PermissionGroupModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

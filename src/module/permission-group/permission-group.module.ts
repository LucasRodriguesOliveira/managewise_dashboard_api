import { Module } from '@nestjs/common';
import { PermissionGroupService } from './permission-group.service';
import { PermissionGroupController } from './permission-group.controller';

@Module({
  providers: [PermissionGroupService],
  controllers: [PermissionGroupController],
})
export class PermissionGroupModule {}

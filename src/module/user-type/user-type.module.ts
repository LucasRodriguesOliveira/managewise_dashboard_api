import { Module } from '@nestjs/common';
import { UserTypeController } from './user-type.controller';
import { UserTypeService } from './user-type.service';
import { PrismaService } from '../../service/prisma.service';

@Module({
  controllers: [UserTypeController],
  providers: [UserTypeService, PrismaService],
})
export class UserTypeModule {}

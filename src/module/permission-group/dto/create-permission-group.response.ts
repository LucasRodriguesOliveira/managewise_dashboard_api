import { ApiProperty } from '@nestjs/swagger';
import { UserTypePermission } from '@prisma/client';
import { randomInt } from 'crypto';

export class CreatePermissionGroupResponse implements UserTypePermission {
  @ApiProperty({
    type: Number,
    example: randomInt(100),
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: randomInt(100),
  })
  userTypeId: number;

  @ApiProperty({
    type: Number,
    example: randomInt(100),
  })
  permissionId: number;
}

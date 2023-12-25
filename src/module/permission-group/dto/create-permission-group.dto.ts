import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { randomInt } from 'crypto';

export class CreatePermissionGroupDto {
  @ApiProperty({
    type: Number,
    example: randomInt(100),
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  userTypeId: number;

  @ApiProperty({
    type: Number,
    example: randomInt(100),
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  permissionId: number;
}

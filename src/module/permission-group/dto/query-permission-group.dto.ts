import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { randomInt } from 'crypto';

export class QueryPermissionGroupDto {
  @ApiProperty({
    type: Number,
    required: false,
    example: randomInt(100),
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userTypeId?: number;
}

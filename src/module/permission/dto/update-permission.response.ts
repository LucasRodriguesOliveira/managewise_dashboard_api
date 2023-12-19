import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class UpdatePermissionResponse {
  @ApiProperty({
    type: Number,
    example: randomInt(100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: randomBytes(10).toString('hex'),
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isActive: boolean;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    description,
    isActive,
    createdAt,
    updatedAt,
  }: Permission): UpdatePermissionResponse {
    return {
      id,
      description,
      isActive,
      createdAt,
      updatedAt,
    };
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class RemovePermissionResponse {
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
    type: Date,
    example: new Date(),
  })
  deletedAt: Date;

  static from({
    id,
    description,
    deletedAt,
  }: Permission): RemovePermissionResponse {
    return {
      id,
      description,
      deletedAt,
    };
  }
}

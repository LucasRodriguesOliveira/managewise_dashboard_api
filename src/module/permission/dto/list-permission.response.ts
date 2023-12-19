import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class ListPermissionResponse {
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
    example: true,
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

  @ApiProperty({
    type: Date,
    example: null,
  })
  deletedAt: Date;

  static map({
    id,
    description,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
  }: Permission): ListPermissionResponse {
    return {
      id,
      description,
      isActive,
      createdAt,
      updatedAt,
      deletedAt,
    };
  }

  static from(permissions: Permission[]): ListPermissionResponse[] {
    return permissions.map(ListPermissionResponse.map);
  }
}

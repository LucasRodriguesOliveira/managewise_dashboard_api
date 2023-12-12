import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class CreateUserTypeResponse {
  @ApiProperty({
    type: Number,
    example: randomInt(25),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: randomBytes(15).toString('hex'),
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

  static from({
    id,
    description,
    isActive,
    createdAt,
    updatedAt,
  }: UserType): CreateUserTypeResponse {
    return {
      id,
      description,
      isActive,
      createdAt,
      updatedAt,
    };
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Section } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class CreateSectionResponse {
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

  static from({
    id,
    description,
    isActive,
    createdAt,
    updatedAt,
  }: Section): CreateSectionResponse {
    return {
      id,
      description,
      isActive,
      createdAt,
      updatedAt,
    };
  }
}

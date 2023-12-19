import { ApiProperty } from '@nestjs/swagger';
import { Section } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class UpdateSectionResponse {
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
  }: Section): UpdateSectionResponse {
    return {
      id,
      description,
      isActive,
      createdAt,
      updatedAt,
    };
  }
}

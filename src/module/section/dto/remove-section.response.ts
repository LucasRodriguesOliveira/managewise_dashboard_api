import { ApiProperty } from '@nestjs/swagger';
import { Section } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class RemoveSectionResponse {
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

  static from({ id, description, deletedAt }: Section): RemoveSectionResponse {
    return {
      id,
      description,
      deletedAt,
    };
  }
}

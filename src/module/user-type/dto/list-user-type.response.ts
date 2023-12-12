import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class ListUserTypeResponse {
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

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  deletedAt: Date;

  static map({
    id,
    description,
    isActive,
    createdAt,
    updatedAt,
    deletedAt,
  }: UserType): ListUserTypeResponse {
    return {
      id,
      description,
      isActive,
      createdAt,
      updatedAt,
      deletedAt,
    };
  }

  static from(userTypes: UserType[]): ListUserTypeResponse[] {
    return userTypes.map(ListUserTypeResponse.map);
  }
}

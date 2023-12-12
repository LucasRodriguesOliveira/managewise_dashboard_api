import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryUserTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: false,
    maxLength: 50,
    nullable: false,
  })
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: true,
    nullable: false,
    default: false,
  })
  includeDeleted?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryListPermissionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: false,
    maxLength: 50,
    nullable: false,
  })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    nullable: false,
    default: false,
  })
  includeExcluded?: boolean;
}

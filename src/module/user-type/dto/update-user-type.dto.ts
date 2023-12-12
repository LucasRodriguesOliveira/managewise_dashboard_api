import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserTypeDto {
  @ApiProperty({
    type: String,
    example: 'New description',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

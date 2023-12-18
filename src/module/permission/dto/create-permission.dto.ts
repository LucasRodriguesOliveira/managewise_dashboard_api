import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: true,
    example: 'LIST',
    maxLength: 50,
  })
  description: string;
}

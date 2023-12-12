import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    maxLength: 50,
    required: true,
  })
  description: string;
}

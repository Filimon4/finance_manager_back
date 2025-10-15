import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SinginRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123' })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}

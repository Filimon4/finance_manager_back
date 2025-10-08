import { IsNotEmpty, IsString } from 'class-validator';

export class SinginRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

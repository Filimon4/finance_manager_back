import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAccountRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}

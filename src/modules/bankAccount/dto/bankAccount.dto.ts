import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBankAccountRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @IsString()
  currencyCode: string;
}

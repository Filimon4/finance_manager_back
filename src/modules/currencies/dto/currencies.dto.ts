import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCurrencyRequestDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsString()
  symbolNative: string;
}

export class GetCurrenciesRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  symbol?: string;
}

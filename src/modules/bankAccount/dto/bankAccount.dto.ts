import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBankAccountRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  baseAmount: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  currencyId: number;
}

export class GetBankAccountRequestDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class UpdateBankAccountRequestDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  main: boolean;
}

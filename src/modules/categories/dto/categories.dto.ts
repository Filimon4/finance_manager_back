import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { $Enums } from '@internal/prisma/client';

export class GetCategoryRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}

export class CreateCategoryRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum($Enums.TransactionType)
  baseType: $Enums.TransactionType = $Enums.TransactionType.EXPENSE;
}

export class UpdateCategoryRequestDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum($Enums.TransactionType)
  baseType: $Enums.TransactionType;
}

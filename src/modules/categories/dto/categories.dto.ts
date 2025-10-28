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
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class GetCategoryRequestDto {
  @ApiProperty({
    required: false,
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }: { value: string | boolean }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}

export class CreateCategoryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum($Enums.TransactionType)
  baseType: $Enums.TransactionType = $Enums.TransactionType.EXPENSE;
}

export class UpdateCategoryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ enum: $Enums.TransactionType })
  @IsOptional()
  @IsEnum($Enums.TransactionType)
  baseType: $Enums.TransactionType;
}

export class GetCategoryOverview {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  bankAccountId?: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  lastAmountMounth: number = 1;
}

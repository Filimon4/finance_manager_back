import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { $Enums } from '@internal/prisma/client';

class IntFilter {
  @IsOptional()
  @Type(() => Number)
  gte?: number;

  @IsOptional()
  @Type(() => Number)
  equals?: number;

  @IsOptional()
  @Type(() => Number)
  lte?: number;
}

export class GetOperationsRequestDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsOptional()
  @Type(() => IntFilter)
  amount?: IntFilter;
}

export class UpdateOperationsRequestDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;
}

export class CreatOperationRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  bankAccountid: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsIn([
    $Enums.TransactionType.INCOME,
    $Enums.TransactionType.EXPENSE,
    'TRANSFER',
  ])
  type: string;

  @ValidateIf(
    (o) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      o.type === 'TRANSFER',
  )
  @IsNotEmpty({
    message: 'toBankAccountId is required for TRANSFER operations',
  })
  @IsInt()
  @IsPositive()
  toBankAccountId: number;

  @IsNotEmpty()
  @IsInt()
  exchangeRate: number;
}

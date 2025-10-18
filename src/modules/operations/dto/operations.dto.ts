import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
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
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

class IntFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  gte?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  equals?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  lte?: number;
}

export enum DateOrder {
  asc = 'asc',
  desc = 'desc',
}

export class GetOperationsRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => IntFilter)
  amount?: IntFilter;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  bankAccountId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date = new Date(moment.now());

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @ApiProperty({ required: false, enum: DateOrder })
  @IsOptional()
  @IsEnum(DateOrder)
  dateOrder?: DateOrder;
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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  bankAccountid: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
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

  @IsOptional()
  @IsInt()
  exchangeRate: number;
}

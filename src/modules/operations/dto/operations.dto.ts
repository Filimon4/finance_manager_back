import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
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

export class GetMainAllOperationsRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date = new Date(moment.now());

  @ApiProperty({ required: false, enum: DateOrder })
  @IsOptional()
  @IsEnum(DateOrder)
  dateOrder?: DateOrder;
}

export class GetOperationsRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsArray({
    each: true,
  })
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => IntFilter)
  amount?: IntFilter;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  bankAccountId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsArray({
    each: true,
  })
  @IsNumber({}, { each: true })
  bankAccountIds?: number[];

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
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsIn([$Enums.TransactionType.INCOME, $Enums.TransactionType.EXPENSE])
  type?: string;
}

export class CreateOperationRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsIn([
    $Enums.TransactionType.INCOME,
    $Enums.TransactionType.EXPENSE,
    'TRANSFER',
  ])
  type?: $Enums.TransactionType | 'TRANSFER';

  @ValidateIf(
    (o) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      o.type === 'TRANSFER',
  )
  @IsOptional({
    message: 'toBankAccountId is required for TRANSFER operations',
  })
  @IsNumber()
  @IsPositive()
  toBankAccountId?: number;
}

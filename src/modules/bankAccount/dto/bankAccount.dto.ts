import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  baseAmount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  currencyId: number;
}

export class GetBankAccountRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  deleted: boolean;
}

export class UpdateBankAccountRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  main: boolean;
}

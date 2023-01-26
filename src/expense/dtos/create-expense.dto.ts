import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly amount: string;

  @IsDate()
  @IsNotEmpty()
  readonly date: Date;
}

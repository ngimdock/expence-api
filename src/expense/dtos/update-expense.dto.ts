import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

// export class UpdateExpenseDto {
//   @IsString()
//   @IsOptional()
//   @MinLength(4)
//   readonly title?: string;

//   @IsString()
//   @IsOptional()
//   readonly description?: string;

//   @IsString()
//   @IsOptional()
//   readonly amount?: string;

//   @IsDateString()
//   @IsOptional()
//   readonly date?: Date;
// }

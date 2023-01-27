import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginateDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly offset?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly limit?: number = 20;
}

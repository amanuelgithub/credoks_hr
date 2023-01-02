import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MonthEnum } from '../enums/month.enum';

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsEnum(MonthEnum)
  month: MonthEnum;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}

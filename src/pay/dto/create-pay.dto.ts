import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MonthEnum } from 'src/payroll/enums/month.enum';

export class CreatePayDto {
  @IsNotEmpty()
  @IsNumber()
  netPay: number;

  @IsNotEmpty()
  @IsNumber()
  deduction: number;

  @IsNotEmpty()
  @IsNumber()
  salaryIncomeTax: number;

  @IsNotEmpty()
  @IsNumber()
  employeePension: number;

  @IsNotEmpty()
  @IsEnum({ enum: MonthEnum })
  month: MonthEnum;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  payrollId: string;
}

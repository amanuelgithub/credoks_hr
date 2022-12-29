import { IsNotEmpty, IsNumber } from 'class-validator';

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
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSalaryRevisionDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsNumber()
  newSalary: number;

  @IsNotEmpty()
  @IsString()
  makerEmployeeId: string;

  @IsNotEmpty()
  @IsString()
  reasonForRevision: string;

  @IsNotEmpty()
  @IsString()
  comments: string;

  // @IsNotEmpty()
  // @IsString()
  // doc: string;
}

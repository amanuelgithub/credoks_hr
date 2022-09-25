import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { EmployeeStatusEnum } from '../employment-status.enum';

export class CreateEmployeeDto {
  @IsEnum(EmployeeStatusEnum)
  status: EmployeeStatusEnum;

  @IsNotEmpty()
  @IsString()
  dateOfJoining: string;

  @IsNotEmpty()
  @IsString()
  confirmationDate: string;

  @IsNotEmpty()
  @IsString()
  emergencyContactName: string;

  @IsNotEmpty()
  @IsString()
  emergencyContactNumber: string;

  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @IsNotEmpty()
  @IsString()
  spouseName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;
}

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmployeeStatusEnum } from '../employment-status.enum';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsEnum(EmployeeStatusEnum)
  status: EmployeeStatusEnum;

  @IsOptional()
  @IsString()
  dateOfJoining: string;

  @IsOptional()
  @IsString()
  confirmationDate: string;

  @IsOptional()
  @IsString()
  emergencyContactName: string;

  @IsOptional()
  @IsString()
  emergencyContactNumber: string;

  @IsOptional()
  @IsString()
  fatherName: string;

  @IsOptional()
  @IsString()
  spouseName: string;

  @IsOptional()
  @IsString()
  accountNumber: string;
}

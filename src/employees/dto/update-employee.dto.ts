import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmployeeStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  hashedRt?: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  type?: UserTypeEnum;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

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

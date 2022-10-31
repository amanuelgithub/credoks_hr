import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmploymentStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { MaritalStatusEnum } from '../enums/marital-status.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  grandFatherName?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @IsString()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  type?: UserTypeEnum;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password?: string;

  @IsOptional()
  @IsString()
  hashedRt?: string;

  @IsOptional()
  @IsEnum(EmploymentStatusEnum)
  employmentStatus: EmploymentStatusEnum;

  @IsOptional()
  @IsEnum(MaritalStatusEnum)
  maritalStatus: MaritalStatusEnum;

  @IsOptional()
  @IsString()
  dateOfJoining: Date;

  @IsOptional()
  @IsString()
  confirmationDate: Date;

  @IsOptional()
  @IsString()
  tinNumber: string;

  @IsOptional()
  @IsString()
  accountNumber: string;
}

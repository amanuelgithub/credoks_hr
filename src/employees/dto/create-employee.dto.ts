import {
  IsString,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  IsDate,
  IsOptional,
} from 'class-validator';
import { EmploymentStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { MaritalStatusEnum } from '../enums/marital-status.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  fatherName?: string;

  @IsNotEmpty()
  @IsString()
  grandFatherName: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  // @IsNotEmpty()
  @IsOptional()
  dateOfBirth?: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type?: UserTypeEnum;

  @IsNotEmpty()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password?: string;

  @IsEnum(EmploymentStatusEnum)
  employmentStatus?: EmploymentStatusEnum;

  @IsEnum(MaritalStatusEnum)
  maritalStatus: MaritalStatusEnum;

  // @IsNotEmpty()
  @IsOptional()
  dateOfJoining?: string;

  // @IsNotEmpty()
  // @IsString()
  // confirmationDate?: Date;

  @IsNotEmpty()
  @IsString()
  tinNumber: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;
}

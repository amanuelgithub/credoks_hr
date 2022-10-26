import {
  IsString,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmployeeStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  lastName?: string;

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

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type?: UserTypeEnum;

  // @IsNotEmpty()
  @IsString()
  dateOfBirth?: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsEnum(EmployeeStatusEnum)
  status?: EmployeeStatusEnum;

  // @IsNotEmpty()
  @IsString()
  dateOfJoining?: string;

  // @IsNotEmpty()
  @IsString()
  confirmationDate?: string;

  @IsNotEmpty()
  @IsString()
  emergencyContactName?: string;

  @IsNotEmpty()
  @IsString()
  emergencyContactNumber?: string;

  @IsNotEmpty()
  @IsString()
  fatherName?: string;

  @IsNotEmpty()
  @IsString()
  spouseName?: string;

  @IsNotEmpty()
  @IsString()
  accountNumber?: string;
}

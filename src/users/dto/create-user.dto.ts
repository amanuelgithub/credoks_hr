import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GenderEnum } from '../gender.enum';
import { UserTypeEnum } from '../user-type.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;

  @IsNotEmpty()
  @IsString()
  dateOfBirth?: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;
}

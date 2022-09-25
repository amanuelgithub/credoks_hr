import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from '../gender.enum';
import { UserTypeEnum } from '../user-type.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;
}

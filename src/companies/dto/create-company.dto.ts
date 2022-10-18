import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyStatusEnum } from '../company-status.enum';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  companyLogo: string;

  @IsNotEmpty()
  @IsEnum(CompanyStatusEnum)
  status: CompanyStatusEnum;
}

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyStatusEnum } from '../company-status.enum';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  summary: string;

  @IsString()
  companyLogo: string;

  @IsEnum(CompanyStatusEnum)
  status: CompanyStatusEnum;
}

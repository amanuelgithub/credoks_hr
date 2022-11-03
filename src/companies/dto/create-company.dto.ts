import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CompanyStatusEnum } from '../company-status.enum';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsEnum(CompanyStatusEnum)
  companyStatus: CompanyStatusEnum;

  @IsOptional()
  @IsString()
  bussinessType: string;

  @IsString()
  summary: string;
}

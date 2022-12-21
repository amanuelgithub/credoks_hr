import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CompanyStatusEnum } from '../company-status.enum';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(CompanyStatusEnum)
  companyStatus: CompanyStatusEnum;

  @IsOptional()
  @IsString()
  bussinessType: string;

  @IsNotEmpty()
  @IsString()
  summary: string;
}

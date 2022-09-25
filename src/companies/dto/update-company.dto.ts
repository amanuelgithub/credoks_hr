import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CompanyStatusEnum } from '../company-status.enum';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  companyLogo: string;

  @IsOptional()
  @IsEnum(CompanyStatusEnum)
  status: CompanyStatusEnum;
}

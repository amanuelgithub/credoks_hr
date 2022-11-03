import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Department } from 'src/departments/entities/department.entity';
import { Location } from 'src/locations/entities/location.entity';
import { CompanyStatusEnum } from '../company-status.enum';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  locations: Location[];

  @IsOptional()
  departments: Department[];

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsEnum(CompanyStatusEnum)
  companyStatus: CompanyStatusEnum;
}

import { IsEnum, IsNotEmpty } from 'class-validator';
import { EmploymentStatusEnum } from '../enums/employment-status.enum';

export class UpdateEmploymentStatusDto {
  @IsNotEmpty()
  @IsEnum(EmploymentStatusEnum)
  employmentStatus: EmploymentStatusEnum;
}

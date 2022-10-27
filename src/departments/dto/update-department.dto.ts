import { IsOptional } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;
}

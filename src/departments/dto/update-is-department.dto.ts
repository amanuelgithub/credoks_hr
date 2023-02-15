import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateIsDepartmentDto {
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsBoolean()
  isDepartmentHead: boolean;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  departmentId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePositionDto {
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

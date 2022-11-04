import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsString()
  departmentId: string;
}

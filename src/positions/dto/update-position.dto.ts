import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  salary: number;
}

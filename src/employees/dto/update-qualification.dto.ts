import { IsOptional, IsString } from 'class-validator';

export class UpdateQualificationDto {
  @IsOptional()
  @IsString()
  education: string;

  @IsOptional()
  @IsString()
  school: string;

  @IsOptional()
  @IsString()
  educationStartedYear: string;

  @IsOptional()
  @IsString()
  educationEndedYear: string;
}

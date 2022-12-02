import { IsOptional, IsString } from 'class-validator';

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  from: string;

  @IsOptional()
  @IsString()
  to: string;
}

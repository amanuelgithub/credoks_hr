import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQualificationDto {
  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  educationStartedYear: string;

  @IsNotEmpty()
  @IsString()
  educationEndedYear: string;

  @IsNotEmpty()
  @IsString()
  employeeId: string;
}

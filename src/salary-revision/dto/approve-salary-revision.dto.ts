import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';
import { SalaryRevisionStatusEnum } from '../salary-revision-status.enum';

export class ApproveSalaryRevisionDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @Matches(SalaryRevisionStatusEnum.APPROVED)
  revisionStatus: SalaryRevisionStatusEnum;

  @IsNotEmpty()
  @IsString()
  checkerEmployeeId: string;

  @IsNotEmpty()
  @IsDate()
  checkerDate: Date;
}

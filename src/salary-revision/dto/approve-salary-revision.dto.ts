import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SalaryRevisionStatusEnum } from '../salary-revision-status.enum';

export class ApproveSalaryRevisionDto {
  @IsNotEmpty()
  @IsEnum(SalaryRevisionStatusEnum, {
    message: "revisionStatus Must be Either 'APPROVE' or 'DECLINED' ",
  })
  revisionStatus: SalaryRevisionStatusEnum;

  @IsNotEmpty()
  @IsString()
  checkerEmployeeId: string;
}

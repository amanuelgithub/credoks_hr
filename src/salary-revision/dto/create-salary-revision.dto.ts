import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { SalaryRevisionStatusEnum } from '../salary-revision-status.enum';

export class CreateSalaryRevisionDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsNumber()
  newSalary: number;

  @IsNotEmpty()
  @IsString()
  makerEmployeeId: string;

  @IsNotEmpty()
  @IsString()
  reasonForRevision: string;

  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsNotEmpty()
  @Matches(SalaryRevisionStatusEnum.PENDING)
  revisionStatus: SalaryRevisionStatusEnum;

  // @IsNotEmpty()
  // @IsString()
  // doc: string;
}

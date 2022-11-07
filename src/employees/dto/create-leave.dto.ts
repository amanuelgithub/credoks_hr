import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LeaveTypeEnum } from '../enums/leave-type.enum';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsEnum(LeaveTypeEnum)
  leaveType: LeaveTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  requestedDays: number;

  @IsNotEmpty()
  @IsString()
  employeeId: string;
}

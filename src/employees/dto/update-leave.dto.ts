import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { LeaveStatusEnum } from '../enums/leave-status.enum';
import { LeaveTypeEnum } from '../enums/leave-type.enum';

export class UpdateLeaveDto {
  @IsOptional()
  @IsEnum(LeaveTypeEnum)
  leaveType: LeaveTypeEnum;

  @IsOptional()
  @IsNumber()
  requestedDays: number;

  @IsOptional()
  @IsNumber()
  garantedDays: number;

  @IsOptional()
  @IsEnum(LeaveStatusEnum)
  leaveStatus: LeaveStatusEnum;
}

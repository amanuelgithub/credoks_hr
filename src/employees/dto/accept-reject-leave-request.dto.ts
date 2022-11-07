import { IsIn, IsNotEmpty } from 'class-validator';
import { LeaveStatusEnum } from '../enums/leave-status.enum';

export class AcceptOrRejectDto {
  @IsNotEmpty()
  @IsIn([LeaveStatusEnum.ACCEPTED, LeaveStatusEnum.DECLINED])
  leaveStatus: LeaveStatusEnum.ACCEPTED | LeaveStatusEnum.DECLINED;
}

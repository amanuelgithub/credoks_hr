import { Equals, IsNotEmpty } from 'class-validator';
import { LeaveStatusEnum } from '../enums/leave-status.enum';

export class CancelLeaveRequestDto {
  @IsNotEmpty()
  @Equals(LeaveStatusEnum.CANCELED)
  leaveStatus: LeaveStatusEnum.CANCELED;
}

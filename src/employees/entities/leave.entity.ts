import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeaveStatusEnum } from '../enums/leave-status.enum';
import { LeaveTypeEnum } from '../enums/leave-type.enum';

@Entity()
export class Leave implements ILeave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LeaveTypeEnum })
  leaveType: LeaveTypeEnum;

  @Column()
  requestedDays: number;

  @Column()
  garantedDays: number;

  @Column({ type: 'enum', enum: LeaveStatusEnum })
  leaveStatus: LeaveStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

interface ILeave {
  id: string;
  leaveType: LeaveTypeEnum;
  requestedDays: number;
  garantedDays: number;
  leaveStatus: LeaveStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

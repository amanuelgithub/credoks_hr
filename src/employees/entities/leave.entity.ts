import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LeaveStatusEnum } from '../enums/leave-status.enum';
import { LeaveTypeEnum } from '../enums/leave-type.enum';
import { Employee } from './employee.entity';

@Entity()
export class Leave implements ILeave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LeaveTypeEnum })
  leaveType: LeaveTypeEnum;

  @Column({})
  requestedDays: number;

  @Column({ nullable: true })
  garantedDays: number;

  @Column({
    type: 'enum',
    enum: LeaveStatusEnum,
    default: LeaveStatusEnum.PENDING,
  })
  leaveStatus: LeaveStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  employeeId: string;

  // entity related fields //
  @ManyToOne(() => Employee, (employee) => employee.leaves)
  employee: Employee;
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

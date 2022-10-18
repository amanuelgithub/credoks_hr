import { Hr } from 'src/hr/entities/hr.entity';
import { Manager } from 'src/managers/enitities/manager.entity';
import { IUser, User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeStatusEnum } from '../employment-status.enum';

@Entity()
export class Employee implements IEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: EmployeeStatusEnum;

  @Column()
  dateOfJoining: string;

  @Column()
  confirmationDate: string;

  @Column()
  emergencyContactName: string;

  @Column()
  emergencyContactNumber: string;

  @Column({ nullable: true })
  fatherName: string;

  @Column({ nullable: true })
  spouseName: string;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  startsAt: string;

  @Column({ nullable: true })
  endsAt: string;

  // entity relation fields //
  @OneToOne(() => User, (user) => user.employee, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToOne(() => Manager, (manager) => manager.employee, {
    onDelete: 'CASCADE',
  })
  manager?: Manager;

  @OneToOne(() => Hr, (hr) => hr.employee, { onDelete: 'CASCADE' })
  hr?: Hr;
}

// reportingManager: undeifined;
export interface IEmployee {
  id: string;
  user: IUser;
  status: EmployeeStatusEnum;
  dateOfJoining: string;
  confirmationDate: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  fatherName: string;
  spouseName: string;
  accountNumber: string;
  startsAt: string;
  endsAt: string;

  //   fields related to an employee position
  //   designation: ????
  //   department: ?????
  //   grade: ????
  //   location: ????
}

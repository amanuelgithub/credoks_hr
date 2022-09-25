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

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}

// reportingManager: undeifined;
export interface IEmployee {
  id: string;
  status: EmployeeStatusEnum;
  dateOfJoining: string;
  confirmationDate: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  fatherName: string;
  spouseName: string;
  accountNumber: string;
  user: IUser;
  //   fields related to an employee position
  //   designation: ????
  //   department: ?????
  //   grade: ????
  //   location: ????
}

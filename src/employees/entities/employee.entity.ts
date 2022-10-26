import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmployeeStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

@Entity()
export class Employee implements IEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  password: string;

  // used to store the hashed refresh-token
  @Column({ nullable: true })
  hashedRt?: string;

  @Column({ nullable: false })
  type: UserTypeEnum;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  gender?: GenderEnum;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @OneToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn()
  company?: Company;
}

// reportingManager: undeifined;
export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  type: UserTypeEnum;
  dateOfBirth?: string;
  gender?: GenderEnum;
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
  createdAt: Date;
  modifiedAt: Date;
  //   fields related to an employee position
  //   designation: ????
  //   department: ?????
  //   grade: ????
  //   location: ????
}

import { Company } from 'src/companies/entities/company.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Position } from 'src/positions/entities/position.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmploymentStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { MaritalStatusEnum } from '../enums/marital-status.enum';
import { UserTypeEnum } from '../enums/user-type.enum';

@Entity()
export class Employee implements IEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  fatherName: string;

  @Column()
  grandFatherName: string;

  @Column({ type: 'enum', enum: GenderEnum })
  gender: GenderEnum;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.EMPLOYEE })
  type: UserTypeEnum;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hashedRt?: string;

  @Column({
    type: 'enum',
    enum: EmploymentStatusEnum,
    default: EmploymentStatusEnum.TRAINEE,
  })
  employmentStatus: EmploymentStatusEnum;

  @Column({
    type: 'enum',
    enum: MaritalStatusEnum,
    default: MaritalStatusEnum.SINGLE,
  })
  maritalStatus: MaritalStatusEnum;

  @Column({ nullable: true, default: 30 })
  totalAllowedLeaves?: number;

  @Column({ nullable: true, default: 30 })
  leaveBalance?: number;

  @Column({ type: 'date' })
  dateOfJoining: Date;

  @Column({ type: 'date' })
  confirmationDate: Date;

  @Column()
  tinNumber: string;

  @Column()
  accountNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entity related fields //
  @OneToOne(() => Company, (company) => company.employees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company: Company;

  @ManyToOne(() => Position, (position) => position.employees, {
    nullable: true,
  })
  position: Position;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @ManyToOne(() => Location, (location) => location.employees)
  location: Location;
}

interface IEmployee {
  id: string;
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  gender: GenderEnum;
  dateOfBirth: Date;
  type: UserTypeEnum;
  email: string;
  phone: string;
  password: string;
  hashedRt?: string;
  employmentStatus: EmploymentStatusEnum;
  maritalStatus: MaritalStatusEnum;
  totalAllowedLeaves?: number;
  leaveBalance?: number;
  dateOfJoining: Date;
  confirmationDate: Date;
  tinNumber: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

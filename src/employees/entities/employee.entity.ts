import {
  LEAVE_POLICY,
  TOTAL_ALLOWED_LEAVES,
} from 'src/employees/leave-policies';
import { Company } from 'src/companies/entities/company.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Position } from 'src/positions/entities/position.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmploymentStatusEnum } from '../enums/employment-status.enum';
import { GenderEnum } from '../enums/gender.enum';
import { MaritalStatusEnum } from '../enums/marital-status.enum';
import { UserTypeEnum } from '../enums/user-type.enum';
import { EmergencyContact } from './emergency-contact.entity';
import { Qualification } from './qualification.entity';

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

  @Column({ nullable: true })
  dateOfBirth: string;

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

  @Column({ nullable: true })
  dateOfJoining: string;

  @Column({ nullable: true })
  confirmationDate: string;

  @Column()
  tinNumber: string;

  @Column()
  accountNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  companyId: string;

  // entity related fields //
  @ManyToOne(() => Company, (company) => company.employees, {
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

  // @ManyToOne(() => Location, (location) => location.employees)
  // location: Location;

  @OneToMany(
    () => EmergencyContact,
    (emergencyContacts) => emergencyContacts.employee,
  )
  @JoinColumn()
  emergencyContacts: EmergencyContact[];

  @OneToMany(() => Qualification, (qualification) => qualification.employee)
  @JoinColumn()
  qualifications: Qualification[];
}

interface IEmployee {
  id: string;
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  gender: GenderEnum;
  dateOfBirth: string;
  type: UserTypeEnum;
  email: string;
  phone: string;
  password: string;
  hashedRt?: string;
  employmentStatus: EmploymentStatusEnum;
  maritalStatus: MaritalStatusEnum;
  dateOfJoining: string;
  confirmationDate: string;
  tinNumber: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

import { Company } from 'src/companies/entities/company.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Pay } from 'src/pay/entities/pay.entity';
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
import { Experience } from './experience.entity';
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
  profileImage?: string;

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
  cv?: string;

  @Column({ nullable: true })
  confirmationDate: string;

  @Column()
  tinNumber: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  salary: number;

  @Column({ nullable: true })
  benefits: number;

  @Column({ nullable: true, default: true })
  eligibleForPayment: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isDepartmentHead: boolean;

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

  @OneToMany(() => Experience, (experience) => experience.employee)
  @JoinColumn()
  experience: Experience;

  @OneToMany(() => Pay, (pay) => pay.employee)
  @JoinColumn()
  pays: Pay[];
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
  profileImage?: string;
  hashedRt?: string;
  employmentStatus: EmploymentStatusEnum;
  maritalStatus: MaritalStatusEnum;
  dateOfJoining: string;
  cv?: string;
  confirmationDate: string;
  tinNumber: string;
  bankName: string;
  bankAccountNumber: string;
  salary: number;
  benefits: number;
  eligibleForPayment: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDepartmentHead: boolean;
}

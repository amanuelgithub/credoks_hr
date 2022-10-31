import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyStatusEnum } from '../company-status.enum';

@Entity()
export class Company implements ICompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ type: 'enum', enum: CompanyStatusEnum })
  companyStatus: CompanyStatusEnum;

  @Column()
  bussinessType: string;

  @Column()
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entity relation fields //
  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => Department, (departments) => departments.company)
  departments: Department[];

  @OneToMany(() => Payroll, (payroll) => payroll.company)
  payrolls: Payroll[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];
}

export interface ICompany {
  id: string;
  name: string;
  logo?: string;
  companyStatus: CompanyStatusEnum;
  bussinessType: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

import { Company } from 'src/companies/entities/company.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Position implements IPosition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  companyId: string;

  @Column()
  departmentId: string;

  // entity relation fields //
  @OneToMany(() => Employee, (employees) => employees.position, {
    nullable: true,
  })
  employees?: Employee[];

  @ManyToOne(() => Department, (department) => department.positions)
  department: Department;

  @ManyToOne(() => Company, (company) => company.positions)
  company: Company;
}

export interface IPosition {
  id: string;
  title: string;
  companyId: string;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

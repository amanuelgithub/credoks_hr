import { Company } from 'src/companies/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Position } from 'src/positions/entities/position.entity';
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
export class Department implements IDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entity relation fields //
  @ManyToOne(() => Company, (company) => company.departments)
  company: Company;

  @OneToMany(() => Position, (position) => position.department)
  positions: Position[];

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}

export interface IDepartment {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

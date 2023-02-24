import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { SalaryRevisionStatusEnum } from '../salary-revision-status.enum';

@Entity()
export class SalaryRevision implements ISalaryRevision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @Column()
  newSalary: number;

  @Column({ default: SalaryRevisionStatusEnum.PENDING })
  revisionStatus: SalaryRevisionStatusEnum;

  @Column({ nullable: true })
  makerEmployeeId: string;

  @Column({ nullable: true })
  checkerEmployeeId: string;

  @Column({ nullable: true })
  makerDate: Date;

  @Column({ nullable: true })
  checkerDate: Date;

  @Column({ nullable: true })
  reasonForRevision: string;

  // provides a place to store additional information about
  // salary revision made
  @Column({ nullable: true })
  comments: string;

  @Column({ nullable: true })
  doc: string;

  // entity relationship related properties
  @ManyToOne(() => Employee, (employee) => employee.salaryRevisions, {
    eager: true,
  })
  employee: Employee;
}

export interface ISalaryRevision {
  id: string;
  employeeId: string;
  newSalary: number;
  revisionStatus: SalaryRevisionStatusEnum;
  makerEmployeeId: string;
  checkerEmployeeId: string;
  // Date when a maker created the salary revision
  makerDate: Date;
  // Date a checker approved the salary revision
  checkerDate: Date;

  reasonForRevision: string;
  comments: string;
  doc: string;
}

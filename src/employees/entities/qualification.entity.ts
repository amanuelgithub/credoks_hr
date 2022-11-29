import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Qualification implements IQualification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  education: string;

  @Column()
  school: string;

  @Column()
  educationStartedYear: string;

  @Column()
  educationEndedYear: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  employeeId: string;

  // entities related fields //
  @ManyToOne(() => Employee, (employee) => employee.qualifications, {
    eager: false,
  })
  employee: Employee;
}

interface IQualification {
  id: string;
  education: string;
  school: string;
  educationStartedYear: string;
  educationEndedYear: string;
  createdAt: Date;
  updatedAt: Date;
}

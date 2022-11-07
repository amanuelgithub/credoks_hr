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

  @Column({ unique: true })
  education: string;

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
  @ManyToOne(() => Employee, (employee) => employee.qualifications)
  employee: Employee;
}

interface IQualification {
  id: string;
  education: string;
  educationStartedYear: string;
  educationEndedYear: string;
  createdAt: Date;
  updatedAt: Date;
}

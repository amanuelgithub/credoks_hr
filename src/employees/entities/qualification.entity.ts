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
  educationStartedDate: Date;

  @Column()
  educationEndedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entities related fields //
  @ManyToOne(() => Employee, (employee) => employee.qualifications)
  employee: Employee;
}

interface IQualification {
  id: string;
  education: string;
  educationStartedDate: Date;
  educationEndedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

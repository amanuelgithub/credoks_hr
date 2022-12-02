import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

export interface IExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  from: string;
  to: string;
}

@Entity()
export class Experience implements IExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobTitle: string;

  @Column()
  companyName: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.experience, {
    eager: false,
  })
  employee: Employee;
}

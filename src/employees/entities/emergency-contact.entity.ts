import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RelationEnum } from '../enums/relation.enum';
import { Employee } from './employee.entity';

@Entity()
export class EmergencyContact implements IEmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'enum', enum: RelationEnum })
  relation: RelationEnum;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  employeeId: string;

  // entity related fields //
  @ManyToOne(() => Employee, (employee) => employee.emergencyContacts)
  employee: Employee;
}

interface IEmergencyContact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  relation: RelationEnum;
  createAt: Date;
  updatedAt: Date;
}

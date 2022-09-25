import { Admin } from 'src/admins/entities/admin.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Manager } from 'src/managers/enitities/manager.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GenderEnum } from '../gender.enum';
import { UserTypeEnum } from '../user-type.enum';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  type: UserTypeEnum;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  gender?: GenderEnum;

  @OneToOne(() => Admin, { onDelete: 'CASCADE' })
  admin?: Admin;

  @OneToOne(() => Manager, { onDelete: 'CASCADE' })
  manager?: Manager;

  @OneToOne(() => Employee, { onDelete: 'CASCADE' })
  employee?: Employee;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  type: UserTypeEnum;
  dateOfBirth?: string;
  gender?: GenderEnum;
  createdAt: Date;
  modifiedAt: Date;
}

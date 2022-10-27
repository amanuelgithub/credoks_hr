import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  qualification: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entity relation fields //
  @OneToMany(() => Employee, (employees) => employees.position, {
    nullable: true,
  })
  employees?: Employee[];
}

export interface IPosition {
  id: string;
  title: string;
  qualification: string;
}

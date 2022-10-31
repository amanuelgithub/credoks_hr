import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RelationEnum } from '../enums/relation.enum';

@Entity()
export class EmergencyContact implements IEmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: RelationEnum })
  relation: RelationEnum;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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

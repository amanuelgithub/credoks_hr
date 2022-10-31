import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}

interface IQualification {
  id: string;
  education: string;
  educationStartedDate: Date;
  educationEndedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Location implements ILocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  specificLocationName?: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  // entity relation fields //
  @ManyToOne(() => Company)
  company: Company;
}

export interface ILocation {
  id: string;
  country: string;
  city: string;
  specificLocationName?: string;
  createdAt: string;
  updatedAt: string;
}

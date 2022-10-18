import { Company } from 'src/companies/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location implements ILocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  // entity relation fields //
  @ManyToOne(() => Company)
  company: Company;
}

export interface ILocation {
  id: string;
  country: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

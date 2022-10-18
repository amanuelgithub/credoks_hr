import { Company } from 'src/companies/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  // entity relation fields //
  @ManyToOne(() => Company, (company) => company.departments)
  company: Company;
}

export interface IDepartment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
}

import { Company } from 'src/companies/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entity relation fields //
  @ManyToOne(() => Company, (company) => company.locations)
  company: Company;

  @OneToMany(() => Employee, (employee) => employee.location)
  employees: Employee[];
}

export interface ILocation {
  id: string;
  country: string;
  city: string;
  specificLocationName?: string;
  createdAt: Date;
  updatedAt: Date;
}

import { Department } from 'src/departments/entities/department.entity';
import { Location } from 'src/locations/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyStatusEnum } from '../company-status.enum';

export interface ICompany {
  id: string;
  name: string;
  companyLogo: string;
  status: CompanyStatusEnum;
  summary: string;
  createdAt: Date;
  modifiedAt: Date;
  locations: Location[];
  departments: Department[];
}

@Entity()
export class Company implements ICompany {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  companyLogo: string;

  @Column()
  status: CompanyStatusEnum;

  @Column()
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  // entity relation fields //
  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => Department, (departments) => departments.company)
  departments: Department[];
}

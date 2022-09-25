import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyStatusEnum } from '../company-status.enum';

export interface ICompany {
  id: string;
  name: string;
  location: string;
  companyLogo: string;
  status: CompanyStatusEnum;
  createdAt: Date;
  modifiedAt: Date;
}

@Entity()
export class Company implements ICompany {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  companyLogo: string;

  @Column()
  status: CompanyStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}

import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MonthEnum } from '../enums/month.enum';

@Entity()
export class Payroll implements IPayroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MonthEnum })
  month: MonthEnum;

  @Column()
  year: number;

  @Column()
  totalNetPaid: number;

  @Column()
  totalTaxPaid: number;

  @Column()
  totalDeduction: number;

  @Column()
  totalPaid: number;

  @Column()
  totalEmployeesPaid: number;

  @CreateDateColumn()
  processedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // entity related fields //
  @ManyToOne(() => Company, (company) => company.payrolls)
  company: Company;
}

interface IPayroll {
  id: string;
  month: MonthEnum;
  year: number;
  totalNetPaid: number;
  totalTaxPaid: number;
  totalDeduction: number;
  totalPaid: number;
  totalEmployeesPaid: number;
  processedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

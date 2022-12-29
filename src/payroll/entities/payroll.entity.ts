import { Company } from 'src/companies/entities/company.entity';
import { Pay } from 'src/pay/entities/pay.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({ type: 'float' })
  totalNetPaid: number;

  @Column({ type: 'float' })
  totalTaxPaid: number;

  @Column({ type: 'float' })
  totalDeduction: number;

  @Column({ type: 'float' })
  totalPaid: number;

  @Column()
  totalEmployeesPaid: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  companyId: string;

  // entity related fields //
  @ManyToOne(() => Company, (company) => company.payrolls)
  company: Company;

  @OneToMany(() => Pay, (pay) => pay.payroll)
  @JoinColumn()
  pays: Pay[];
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
  // processedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

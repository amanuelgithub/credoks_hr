import { Employee } from 'src/employees/entities/employee.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { MonthEnum } from 'src/payroll/enums/month.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pay implements IPay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  netPay: number;

  @Column({ type: 'float' })
  deduction: number;

  @Column({ type: 'float' })
  salaryIncomeTax: number;

  @Column({ type: 'float' })
  employeePension: number;

  @Column({ type: 'enum', enum: MonthEnum })
  month: MonthEnum;

  @Column()
  year: number;

  @Column({ nullable: true })
  payrollId: string;

  @ManyToOne(() => Employee, (employee) => employee.pays, { eager: false })
  employee: Employee;

  @ManyToOne(() => Payroll, (payroll) => payroll.pays, { eager: false })
  payroll: Payroll;
}

export interface IPay {
  id: string;
  netPay: number;
  deduction: number;
  salaryIncomeTax: number;
  employeePension: number;
  payrollId: string;
  year: number;
  month: MonthEnum;
}

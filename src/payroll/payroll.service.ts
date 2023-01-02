import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ConflictException, HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { EmployeesService } from 'src/employees/services/employees.service';
import { CreatePayDto } from 'src/pay/dto/create-pay.dto';
import { Pay } from 'src/pay/entities/pay.entity';
import { payRangeWithTaxRateAndDeduction } from 'src/pay/pay-range-with-tax-rate-and-deduction';
import { PayService } from 'src/pay/pay.service';
import { Repository } from 'typeorm';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Payroll } from './entities/payroll.entity';
import { MonthEnum } from './enums/month.enum';

interface IEmployeePay {
  employee: Employee;
  netPay: number;
  deduction: number;
  salaryIncomeTax: number;
  employeePension: number;
}

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    private companiesService: CompaniesService,
    private employeesService: EmployeesService,
    private payService: PayService,
  ) {}

  /** pay.entity.ts fields (i.e for single employee) */
  // netPay
  // deduction
  // salaryIncomeTax
  //
  //
  /** payroll.entity.ts fields */
  // totalNetPaid
  // totalTaxPaid - i.e totalIncomeTaxPaid
  // totalDeduction
  // totalPaid
  // totalEmployeesPaid
  private calculatePayroll(employees: Employee[]): IEmployeePay[] {
    const employeesPay: IEmployeePay[] = [];

    employees.map((employee) => {
      // Employee Pension Amount is constant = 7%
      const employeePension = employee.salary * 0.07;

      const payRange = this.getPayRangeClass(employee.salary);

      // Tax Amount
      const taxRate = payRange.taxRate;
      const deduction = payRange.deduction;

      // SalaryIncomeTax = (GrossSalary * TaxRate) - Deduction
      const salaryIncomeTax = employee.salary * taxRate - deduction;

      // Net Income = GrossSalary - SalaryIncomeTax - EmployeePension - OtherTaxes (if applicable)
      const netPay = employee.salary - salaryIncomeTax - employeePension;

      console.log(
        'Gross Salary: ',
        employee.salary,
        ' Tax Rate: ',
        payRange.taxRate,
        ' Deduction: ',
        payRange.deduction,
        ' Salary Income Tax: ',
        salaryIncomeTax,
        ' Net Pay: ',
        netPay,
      );

      employeesPay.push({
        employee,
        netPay,
        deduction,
        salaryIncomeTax,
        employeePension,
      });
    });

    return employeesPay;
  }

  private getPayRangeClass(grossSalary: number): {
    range: {
      from: number;
      to: number;
    };
    taxRate: number;
    deduction: number;
  } {
    const payClass = Object.keys(payRangeWithTaxRateAndDeduction);

    for (let index = 0; index < payClass.length; index++) {
      if (
        grossSalary >=
          payRangeWithTaxRateAndDeduction[payClass[index]].range.from &&
        grossSalary <= payRangeWithTaxRateAndDeduction[payClass[index]].range.to
      ) {
        return payRangeWithTaxRateAndDeduction[payClass[index]];
      }
    }
  }

  /** check if payroll is already processed for the specified year and month */
  private async checkIfPayrollIsAlreadyProcessed(
    year: number,
    month: MonthEnum,
  ) {
    const payroll = await this.payrollRepository
      .createQueryBuilder('payroll')
      .where('year = :year', { year })
      .andWhere('month = :month', { month })
      .getOne();

    if (payroll) {
      return true;
    }

    return false;
  }

  async create(createPayrollDto: CreatePayrollDto): Promise<any> {
    const { companyId, month, year } = createPayrollDto;

    if (await this.checkIfPayrollIsAlreadyProcessed(year, month)) {
      throw new ConflictException(
        `Payroll already processed for year: ${year} and month: ${month}`,
      );
    }

    const pays: Pay[] = [];

    let totalNetPaid = 0;
    let totalTaxPaid = 0;
    let totalDeduction = 0;
    let totalPaid = 0;
    let totalEmployeesPaid = 0;

    const company = await this.companiesService.findOne(companyId);

    // find list of employees whose are eligable-for-payment is active using the company's id
    const employees = await this.employeesService.findAllActiveEmployees(
      companyId,
    );

    const payrollInstance = this.payrollRepository.create({
      ...createPayrollDto,
      company,
    });

    const processedPayrolls = this.calculatePayroll(employees);

    for (let i = 0; i < processedPayrolls.length; i++) {
      const processedPayroll = processedPayrolls[i];

      const pay = await this.payService.create({
        payrollId: payrollInstance.id,
        employee: processedPayroll.employee,
        netPay: processedPayroll.netPay,
        deduction: processedPayroll.deduction,
        salaryIncomeTax: processedPayroll.salaryIncomeTax,
        employeePension: processedPayroll.employeePension,
        month: month,
        year: year,
      } as CreatePayDto);

      pays.push({ ...pay });

      totalNetPaid += processedPayroll.netPay;
      totalTaxPaid += processedPayroll.salaryIncomeTax;
      totalDeduction += processedPayroll.deduction;
      totalPaid +=
        processedPayroll.salaryIncomeTax + processedPayroll.deduction;
      totalEmployeesPaid += 1;
    }

    // link all list of processed pays to the pays array in the payroll `pays` field
    payrollInstance.pays = pays;

    payrollInstance.totalNetPaid = totalNetPaid;
    payrollInstance.totalTaxPaid = totalTaxPaid;
    payrollInstance.totalDeduction = totalDeduction;
    payrollInstance.totalPaid = totalPaid;
    payrollInstance.totalEmployeesPaid = totalEmployeesPaid;

    await this.payrollRepository.save(payrollInstance);

    throw new HttpException('Success', HttpStatus.CREATED);
  }

  async findAll(): Promise<Payroll[]> {
    const payrolls = await this.payrollRepository.find();

    if (!payrolls) {
      throw new NotFoundException('No Payroll found!');
    }

    return payrolls;
  }
}

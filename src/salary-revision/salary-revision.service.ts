import { Injectable } from '@nestjs/common';
import { CreateSalaryRevisionDto } from './dto/create-salary-revision.dto';
import { ApproveSalaryRevisionDto } from './dto/approve-salary-revision.dto';
import { Repository } from 'typeorm';
import { SalaryRevision } from './entities/salary-revision.entity';
import { EmployeesService } from '../employees/services/employees.service';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { getCurrentDate } from '../utils/time';

@Injectable()
export class SalaryRevisionService {
  constructor(
    @InjectRepository(SalaryRevision)
    private salaryRevisionRepository: Repository<SalaryRevision>,
    private readonly employeeService: EmployeesService,
  ) {}

  async create(
    createSalaryRevisionDto: CreateSalaryRevisionDto,
  ): Promise<SalaryRevision> {
    const {
      employeeId,
      newSalary,
      revisionStatus,
      makerEmployeeId,
      // makerDate,
      reasonForRevision,
      comments,
    } = createSalaryRevisionDto;

    if (await this.empHavePendingSalaryRevision(employeeId)) {
      throw new ConflictException(
        'Pending Salary Revision for this employee already exists!',
      );
    }

    const employee = await this.employeeService.findEmployeeById(employeeId);
    const makerEmployee = await this.employeeService.findEmployeeById(
      makerEmployeeId,
    );

    const salaryRevision = this.salaryRevisionRepository.create({
      employeeId,
      newSalary,
      revisionStatus,
      makerEmployeeId,
      makerDate: getCurrentDate(),
      reasonForRevision,
      comments,
    });

    salaryRevision.employee = employee;
    salaryRevision.makerEmployee = makerEmployee;

    return await this.salaryRevisionRepository.save(salaryRevision);
  }

  async approve(
    salaryRevisionId: string,
    approveSalaryRevisionDto: ApproveSalaryRevisionDto,
  ) {
    const { employeeId, checkerEmployeeId, checkerDate, revisionStatus } =
      approveSalaryRevisionDto;

    const salaryRevision = await this.findOne(salaryRevisionId);

    const checkerEmployee = await this.employeeService.findEmployeeById(
      employeeId,
    );

    salaryRevision.checkerEmployeeId = checkerEmployeeId;
    salaryRevision.revisionStatus = revisionStatus;
    salaryRevision.checkerDate = checkerDate;

    salaryRevision.checkerEmployee = checkerEmployee;

    await this.salaryRevisionRepository.save(salaryRevision);
  }

  async findAll(): Promise<SalaryRevision[]> {
    const salaryRevisions = await this.salaryRevisionRepository.find();

    if (!salaryRevisions) {
      throw new NotFoundException('No salary revision is found!');
    }

    return salaryRevisions;
  }

  async findEmployeeSalaryRevisions(
    employeeId: string,
  ): Promise<SalaryRevision[]> {
    const empSalaryRevisions = await this.salaryRevisionRepository.find({
      where: { employeeId },
    });

    if (!empSalaryRevisions) {
      throw new NotFoundException('No salary revision is found!');
    }

    return empSalaryRevisions;
  }

  async findOne(id: string): Promise<SalaryRevision> {
    const salaryRevision = await this.salaryRevisionRepository.findOne({
      where: { id },
    });

    if (!salaryRevision) {
      throw new NotFoundException('Salary revision not found');
    }

    return salaryRevision;
  }

  remove(id: number) {
    return `This action removes a #${id} salaryRevision`;
  }

  async empHavePendingSalaryRevision(employeeId: string): Promise<boolean> {
    const empSalaryRevisions = await this.findEmployeeSalaryRevisions(
      employeeId,
    );
    const pendingRevision = empSalaryRevisions.find(
      (revision) => revision.employeeId === employeeId,
    );

    return !!pendingRevision;
  }
}

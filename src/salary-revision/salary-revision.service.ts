import { Injectable } from '@nestjs/common';
import { CreateSalaryRevisionDto } from './dto/create-salary-revision.dto';
import { ApproveSalaryRevisionDto } from './dto/approve-salary-revision.dto';
import { Repository } from 'typeorm';
import { SalaryRevision } from './entities/salary-revision.entity';
import { EmployeesService } from '../employees/services/employees.service';
import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { getCurrentDate } from '../utils/time';
import { SalaryRevisionStatusEnum } from './salary-revision-status.enum';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Injectable()
export class SalaryRevisionService {
  constructor(
    @InjectRepository(SalaryRevision)
    private salaryRevisionRepository: Repository<SalaryRevision>,
    private readonly employeeService: EmployeesService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(
    createSalaryRevisionDto: CreateSalaryRevisionDto,
  ): Promise<SalaryRevision> {
    const {
      employeeId,
      newSalary,
      makerEmployeeId,
      reasonForRevision,
      comments,
    } = createSalaryRevisionDto;

    const empHavePendingSalRevs = await this.empHavePendingSalaryRevision(
      employeeId,
    );
    if (empHavePendingSalRevs) {
      throw new ConflictException(
        'Pending Salary Revision for this employee already exists!',
      );
    }

    const employee = await this.employeeService.findEmployeeById(employeeId);

    const salaryRevision = this.salaryRevisionRepository.create({
      employeeId,
      newSalary,
      makerEmployeeId,
      makerDate: getCurrentDate(),
      reasonForRevision,
      comments,
    });

    salaryRevision.employee = employee;

    return await this.salaryRevisionRepository.save(salaryRevision);
  }

  async approve(
    salaryRevisionId: string,
    approveSalaryRevisionDto: ApproveSalaryRevisionDto,
  ) {
    const { checkerEmployeeId, revisionStatus } = approveSalaryRevisionDto;

    const salaryRevision = await this.findOne(salaryRevisionId);

    salaryRevision.checkerEmployeeId = checkerEmployeeId;
    salaryRevision.revisionStatus = revisionStatus;
    salaryRevision.checkerDate = getCurrentDate();

    await this.salaryRevisionRepository.save(salaryRevision);
  }

  async findAll(): Promise<SalaryRevision[]> {
    const salaryRevisions = await this.salaryRevisionRepository.find();

    if (!salaryRevisions) {
      throw new NotFoundException('No salary revision is found!');
    }

    return salaryRevisions;
  }

  async findAllSalaryRevisionsOfCompany(
    requestingUser: any,
    companyId: string,
  ): Promise<SalaryRevision[]> {
    const { companyId: reqUserCompanyId } = requestingUser;

    if (reqUserCompanyId !== companyId) {
      throw new ForbiddenException();
    }

    const salaryRevisions = await this.salaryRevisionRepository.find();

    const companySalaryRevisions: SalaryRevision[] = salaryRevisions.filter(
      (salaryRevision) => salaryRevision.employee.companyId === companyId,
    );

    if (!companySalaryRevisions) {
      throw new NotFoundException(
        'No salary revision for this company is found!',
      );
    }

    return companySalaryRevisions;
  }

  async findAllPendingSalaryRevisionsOfCompany(
    requestingUser: any,
    companyId: string,
  ): Promise<SalaryRevision[]> {
    const { companyId: reqUserCompanyId } = requestingUser;

    if (reqUserCompanyId !== companyId) {
      throw new ForbiddenException();
    }

    const pendingSalaryRevisions = await this.salaryRevisionRepository.find({
      where: { revisionStatus: SalaryRevisionStatusEnum.PENDING },
    });

    const pendingCompanySalaryRevisions: SalaryRevision[] =
      pendingSalaryRevisions.filter(
        (salaryRevision) => salaryRevision.employee.companyId === companyId,
      );

    if (!pendingCompanySalaryRevisions) {
      throw new NotFoundException('No pending salary revision is found!');
    }

    return pendingCompanySalaryRevisions;
  }

  async findAllEmployeeSalaryRevisions(
    employeeId: string,
    requestingUser: any,
  ): Promise<SalaryRevision[]> {
    console.log('employeeId', employeeId);
    return await this.findEmployeeSalaryRevisions(employeeId, requestingUser);
  }

  private async findEmployeeSalaryRevisions(
    employeeId: string,
    requestingUser?: any,
  ): Promise<SalaryRevision[]> {
    const employee = await this.employeeService.findEmployeeById(employeeId);

    if (requestingUser) {
      const { companyId: reqUserCompanyId } = requestingUser;
      if (reqUserCompanyId !== employee.companyId) {
        throw new ForbiddenException();
      }
    }

    const empSalaryRevisions = await this.salaryRevisionRepository.find({
      where: { employeeId },
    });

    if (!empSalaryRevisions) {
      throw new NotFoundException(
        'No salary revision is found for this employee!',
      );
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

  // helper functions
  async empHavePendingSalaryRevision(employeeId: string): Promise<boolean> {
    const empSalaryRevisions = await this.findEmployeeSalaryRevisions(
      employeeId,
    );

    const pendingRevision = empSalaryRevisions.filter(
      (revision) =>
        revision.revisionStatus === SalaryRevisionStatusEnum.PENDING,
    );

    return pendingRevision.length === 0 ? false : true;
  }
}

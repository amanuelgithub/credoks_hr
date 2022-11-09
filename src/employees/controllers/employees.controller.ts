import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  EmployeesService,
  ICompanyEmployeeReport,
} from '../services/employees.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // util function to create a new employee with out requering any king auth
  @Post()
  createAdmin(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeesService.createAdmin(createEmployeeDto);
  }

  // create a new employee to specified company
  @Post('/company/:companyId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Employee))
  createEmployeeInCompany(
    @Req() req,
    @Param('companyId') companyId: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    console.log('user type: ', req.user.type);
    return this.employeesService.createEmployeeInCompany(
      req.user,
      companyId,
      createEmployeeDto,
    );
  }

  // all employees of all companies
  @Get()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Employee))
  findAllEmployees(): Promise<Employee[]> {
    return this.employeesService.findEmployeesInCompanies();
  }

  // returns all employees based on the requesting employee company
  @Get('/company/:companyId')
  @UseGuards(AtGuard)
  async findEmployeesByCompany(
    @Req() req,
    @Param('companyId') companyId: string,
  ): Promise<Employee[]> {
    const employees = await this.employeesService.findEmployeesByCompany(
      req.user,
      companyId,
    );

    return employees;
  }

  @Get('/:id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Employee))
  async findOneEmployee(
    @Req() req,
    @Param('id') id: string,
  ): Promise<Employee> {
    return this.employeesService.findOneEmployee(req.user, id);
  }

  @Patch('/:id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Employee))
  updateEmployee(
    @Req() req,
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.updateEmployee(
      req.user,
      id,
      updateEmployeeDto,
    );
  }

  @Delete('/:id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Employee))
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  // reporting
  @Get('/report/company-employees-report')
  @UseGuards(AtGuard)
  companiesEmployeesReport(): Promise<ICompanyEmployeeReport[]> {
    return this.employeesService.companiesEmployeesReport();
  }
}

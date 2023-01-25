import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
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
import { ChangePasswordDto } from '../dto/change-password.dto';

import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateEmploymentStatusDto } from '../dto/update-employment-status.dto';

/**
 * used to store the uploaded profileImage to the
 * destination folder specified
 */
export const storageEmpProfileImage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

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

  @Patch('/:id/update-employement-status')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Employee))
  updateEmployementStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() updateEmploymentStatusDto: UpdateEmploymentStatusDto,
  ): Promise<Employee> {
    console.log('updateEmploymentStatus', updateEmploymentStatusDto);
    return this.employeesService.updateEmployementStatus(
      req.user,
      id,
      updateEmploymentStatusDto,
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

  @Patch('/:id/change-password/')
  @UseGuards(AtGuard)
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.employeesService.changePassword(id, changePasswordDto);
  }

  @Post('upload-profile-img/:id')
  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('file', storageEmpProfileImage))
  uploadProfileImage(@Param('id') id: string, @UploadedFile() file) {
    return this.employeesService.uploadProfileImage(id, {
      profileImage: file.filename,
    });
  }

  @Get('profile-images/:imagename')
  // @UseGuards(AtGuard)
  findProfileImage(
    @Param('imagename') imagename,
    @Response() res,
  ): Promise<any> {
    return res.sendFile(
      join(process.cwd(), 'uploads/profileImages/' + imagename),
    );
  }
}

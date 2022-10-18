import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.create(companyId, createDepartmentDto);
  }

  @Get()
  findDepartments(): Promise<Department[]> {
    return this.departmentsService.findDepartments();
  }

  @Get(':companyId')
  findDepartmentsOfCompany(
    @Param('companyId') companyId: string,
  ): Promise<Department[]> {
    return this.departmentsService.findDepartmentsOfCompany(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}

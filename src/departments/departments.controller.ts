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
import { AtGuard } from 'src/auth/guards/at.guard';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Department),
  )
  createDepartmentForCompany(
    @Req() req,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.createDepartmentForCompany(
      req.user,
      createDepartmentDto,
    );
  }

  @Get()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Department),
  )
  findDepartments(): Promise<Department[]> {
    return this.departmentsService.findDepartments();
  }

  @Get('company/:companyId')
  @UseGuards(AtGuard)
  findDepartmentsOfCompany(
    @Req() req,
    @Param('companyId') companyId: string,
  ): Promise<Department[]> {
    return this.departmentsService.findDepartmentsByCompany(
      req.user,
      companyId,
    );
  }

  @Get(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Department))
  findOneDepartment(@Req() req, @Param('id') id: string): Promise<Department> {
    return this.departmentsService.findOneDepartment(req.user, id);
  }

  @Patch(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Department),
  )
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.updateDepartment(
      req.user,
      id,
      updateDepartmentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}

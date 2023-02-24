import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalaryRevisionService } from './salary-revision.service';
import { CreateSalaryRevisionDto } from './dto/create-salary-revision.dto';
import { ApproveSalaryRevisionDto } from './dto/approve-salary-revision.dto';
import { SalaryRevision } from './entities/salary-revision.entity';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Ability } from '@casl/ability';
import { Action } from 'src/casl/casl-ability.factory';

@Controller('salary-revision')
export class SalaryRevisionController {
  constructor(private readonly salaryRevisionService: SalaryRevisionService) {}

  @Post('/make')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) =>
    ability.can(Action.Create, SalaryRevision),
  )
  create(@Body() createSalaryRevisionDto: CreateSalaryRevisionDto) {
    return this.salaryRevisionService.create(createSalaryRevisionDto);
  }

  @Patch(':id/approve')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) =>
    ability.can(Action.Update, SalaryRevision),
  )
  approve(
    @Param('id') id: string,
    @Body() approveSalaryRevisionDto: ApproveSalaryRevisionDto,
  ) {
    return this.salaryRevisionService.approve(id, approveSalaryRevisionDto);
  }

  @Get()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) =>
    ability.can(Action.Manage, SalaryRevision),
  )
  findAll() {
    return this.salaryRevisionService.findAll();
  }

  @Get('/company/:companyId/pending')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can(Action.Read, SalaryRevision))
  findAllPendingSalaryRevisionsOfCompany(
    @Req() req,
    @Param('companyId') companyId: string,
  ) {
    return this.salaryRevisionService.findAllPendingSalaryRevisionsOfCompany(
      req.user,
      companyId,
    );
  }

  @Get('/company/:companyId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can(Action.Read, SalaryRevision))
  findAllSalaryRevisionsOfCompany(
    @Req() req,
    @Param('companyId') companyId: string,
  ) {
    return this.salaryRevisionService.findAllSalaryRevisionsOfCompany(
      req.user,
      companyId,
    );
  }

  @Get('/employee/:employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can(Action.Read, SalaryRevision))
  findEmployeeSalaryRevisions(
    @Req() req,
    @Param('employeeId') employeeId: string,
  ): Promise<SalaryRevision[]> {
    return this.salaryRevisionService.findAllEmployeeSalaryRevisions(
      employeeId,
      req.user,
    );
  }

  @Get(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: Ability) => ability.can(Action.Read, SalaryRevision))
  findOne(@Param('id') id: string): Promise<SalaryRevision> {
    return this.salaryRevisionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryRevisionService.remove(+id);
  }
}

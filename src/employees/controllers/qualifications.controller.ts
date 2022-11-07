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
import { QualificationsService } from '../services/qualifications.service';
import { CreateQualificationDto } from '../dto/create-qualification.dto';
import { UpdateQualificationDto } from '../dto/update-qualification.dto';
import { Qualification } from '../entities/qualification.entity';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { AtGuard } from 'src/auth/guards/at.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';

@Controller('qualifications')
export class QualificationsController {
  constructor(private readonly qualificationsService: QualificationsService) {}

  @Post(':employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Qualification),
  )
  create(
    @Req() req,
    @Param('employeeId') employeeId: string,
    @Body() createQualificationDto: CreateQualificationDto,
  ): Promise<Qualification> {
    return this.qualificationsService.createQualificationForEmployee(
      req.user,
      employeeId,
      createQualificationDto,
    );
  }

  @Get('/employee/:employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Qualification),
  )
  findQualificationsOfEmployee(
    @Req() req,
    @Param('employeeId') employeeId: string,
  ): Promise<Qualification[]> {
    return this.qualificationsService.findQualificationByEmployeeId(
      req.user,
      employeeId,
    );
  }

  @Get(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Qualification),
  )
  findQualification(
    @Req() req,
    @Param('id') id: string,
  ): Promise<Qualification> {
    return this.qualificationsService.findQualification(req.user, id);
  }

  @Patch(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Qualification),
  )
  updateQualification(
    @Req() req,
    @Param('id') id: string,
    @Body() updateQualificationDto: UpdateQualificationDto,
  ): Promise<Qualification> {
    return this.qualificationsService.updateQualification(
      req.user,
      id,
      updateQualificationDto,
    );
  }

  @Delete(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Qualification),
  )
  remove(@Param('id') id: string): Promise<void> {
    return this.qualificationsService.remove(id);
  }
}

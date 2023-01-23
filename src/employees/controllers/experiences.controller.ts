import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { ExperiencesService } from '../services/experiences.service';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { AtGuard } from 'src/auth/guards/at.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceDto } from '../dto/create-experience.dto';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post(':employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Experience),
  )
  create(
    @Req() req,
    @Param('employeeId') employeeId: string,
    @Body() createExperienceDto: CreateExperienceDto,
  ): Promise<Experience> {
    return this.experiencesService.createExperienceForEmployee(
      req.user,
      employeeId,
      createExperienceDto,
    );
  }

  @Get('/employee/:employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Experience),
  )
  findExperiencesOfEmployee(
    @Req() req,
    @Param('employeeId') employeeId: string,
  ): Promise<Experience[]> {
    return this.experiencesService.findExperienceByEmployeeId(
      req.user,
      employeeId,
    );
  }

  @Delete(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Experience),
  )
  remove(@Param('id') id: string): Promise<void> {
    return this.experiencesService.remove(id);
  }
}

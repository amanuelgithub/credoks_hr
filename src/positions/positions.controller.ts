import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at.guard';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Position))
  createPosition(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    return this.positionsService.createPosition(createPositionDto);
  }

  @Get('/department/:departmentId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Position))
  findPositionsByDepartment(
    @Param('departmentId') departmentId: string,
  ): Promise<Position[]> {
    return this.positionsService.findPositionsByDepartment(departmentId);
  }

  @Get()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Position))
  findAllPositions(): Promise<Position[]> {
    return this.positionsService.findAllPositions();
  }

  @Get(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Position))
  findPosition(@Param('id') id: string): Promise<Position> {
    return this.positionsService.findPosition(id);
  }

  @Patch(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Position))
  updatePosition(
    @Param('id') id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    return this.positionsService.updatePosition(id, updatePositionDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Position))
  remove(@Param('id') id: string): Promise<void> {
    return this.positionsService.remove(id);
  }
}

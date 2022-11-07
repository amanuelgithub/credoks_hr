import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LeaveService } from '../services/leave.service';
import { CreateLeaveDto } from '../dto/create-leave.dto';
import { UpdateLeaveDto } from '../dto/update-leave.dto';
import { Leave } from '../entities/leave.entity';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';

// list of endpoints to be created

/**
 * 1.(done) request leave (create leave a pending status)
 *   1.1 if possible integrate a notification/alert system when a new leave is requested
 * 2. view list of new requested leaves <-> provide the hr, or manager the number of total leaves
 *    a requester is left, inorder for them to make dissision.
 * 3. view list of accepted and rejected leaves of the last six months
 * 4. approve or reject leave requests
 * 5. the ability to cancel a request once it was sent
 */

@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Leave))
  create(@Body() createLeaveDto: CreateLeaveDto): Promise<Leave> {
    return this.leaveService.create(createLeaveDto);
  }
}

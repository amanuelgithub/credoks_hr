import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { LeaveService } from '../services/leave.service';
import { CreateLeaveDto } from '../dto/create-leave.dto';
import { Leave } from '../entities/leave.entity';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { CancelLeaveRequestDto } from '../dto/cancel-leave-request.dto';
import { AcceptOrRejectDto } from '../dto/accept-reject-leave-request.dto';

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
  constructor(private readonly leavesService: LeaveService) {}

  @Get('/:companyId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Leave))
  findLeavesInCompany(
    @Req() req,
    @Param('companyId') companyId: string,
  ): Promise<Leave[]> {
    return this.leavesService.findLeavesInCompany(req.user, companyId);
  }

  @Get('/:employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Leave))
  findLeavesByEmployeeId(
    @Req() req,
    @Param('employeeId') companyId: string,
  ): Promise<Leave[]> {
    return this.leavesService.findLeaveByEmployeeId(req.user, companyId);
  }

  @Post()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Leave))
  create(@Body() createLeaveDto: CreateLeaveDto): Promise<Leave> {
    return this.leavesService.create(createLeaveDto);
  }

  // cancel leave status request
  @Patch('/cancel/:id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Leave))
  cancelRequest(
    @Req() req,
    @Param('id') id: string,
    @Body() cancelLeaveRequestDto: CancelLeaveRequestDto,
  ): Promise<Leave> {
    return this.leavesService.cancelLeaveRequest(
      req.user,
      id,
      cancelLeaveRequestDto,
    );
  }

  // accept or reject a leave request
  @Patch('/accept-reject/:id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Leave))
  accepteOrRejectRequest(
    @Req() req,
    @Param('id') id: string,
    @Body() accepteOrRejectRequestDto: AcceptOrRejectDto,
  ): Promise<Leave> {
    return this.leavesService.acceptOrRejectRequest(
      req.user,
      id,
      accepteOrRejectRequestDto,
    );
  }
}

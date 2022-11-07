import { ForbiddenError } from '@casl/ability';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Repository } from 'typeorm';
import { CancelLeaveRequestDto } from '../dto/cancel-leave-request.dto';
import { CreateLeaveDto } from '../dto/create-leave.dto';
import { Leave } from '../entities/leave.entity';
import { LeaveTypeEnum } from '../enums/leave-type.enum';
import { EmployeesService } from './employees.service';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leavesRepository: Repository<Leave>,
    private employeesService: EmployeesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    const employeeLeaveBalances = await this.employeesService.getLeaveBalances(
      createLeaveDto.employeeId,
    );

    const { leaveType, requestedDays } = createLeaveDto;

    if (
      requestedDays >= 1 &&
      ((leaveType === LeaveTypeEnum.SICK_LEAVE &&
        requestedDays <= employeeLeaveBalances.totalSickLeaveBalance) ||
        (leaveType === LeaveTypeEnum.ANNUAL_LEAVE &&
          requestedDays <= employeeLeaveBalances.totalAnnualLeaveBalance) ||
        (leaveType === LeaveTypeEnum.MARRIAGE_LEAVE &&
          requestedDays <= employeeLeaveBalances.totalMarriageLeaveBalance) ||
        (leaveType === LeaveTypeEnum.MATERNITY_LEAVE &&
          requestedDays <= employeeLeaveBalances.totalMaternityLeaveBalance) ||
        (leaveType == LeaveTypeEnum.PATERNITY_LEAVE &&
          requestedDays <= employeeLeaveBalances.totalPaternityLeaveBalance))
    ) {
      // continue processing the leave request
      const leave = this.leavesRepository.create(createLeaveDto);

      return await this.leavesRepository.save(leave);
    } else {
      throw new HttpException(
        'Requested Leave Days exceeds the allwed days for the leave type. Please try with other leave types.',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async cancelLeaveRequest(
    requester: any,
    id: string,
    cancelLeaveRequestDto: CancelLeaveRequestDto,
  ): Promise<Leave> {
    const leave = await this.findLeave(id);

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);
    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to cancel this leave request')
        .throwUnlessCan(Action.Update, leave);

      leave.leaveStatus = cancelLeaveRequestDto.leaveStatus;

      return await this.leavesRepository.save(leave);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async findLeave(id: string): Promise<Leave> {
    const leave = await this.leavesRepository.findOne({ where: { id } });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }
}

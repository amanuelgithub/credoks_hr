import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}

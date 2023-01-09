import { Controller, Get, Param } from '@nestjs/common';
import { Pay } from './entities/pay.entity';
import { PayService } from './pay.service';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Get(':payrollId')
  findAllPaysPayPayrollId(
    @Param('payrollId') payrollId: string,
  ): Promise<Pay[]> {
    return this.payService.findAllPaysPayPayrollId(payrollId);
  }

  /** find all payment related information. used for the payslip page */
  @Get('/:payId/payslip')
  findPayInfoByPayId(@Param('payId') payId: string): Promise<Pay> {
    return this.payService.findPayById(payId);
  }
}

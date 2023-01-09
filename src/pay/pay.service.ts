import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePayDto } from './dto/create-pay.dto';
import { Pay } from './entities/pay.entity';

@Injectable()
export class PayService {
  constructor(
    @InjectRepository(Pay)
    private payRepository: Repository<Pay>,
  ) {}

  async create(createPayDto: CreatePayDto) {
    const pay = this.payRepository.create(createPayDto);

    return await this.payRepository.save(pay);
  }

  findAllPaysPayPayrollId(payrollId: string): Promise<Pay[]> {
    const pays = this.payRepository
      .createQueryBuilder('pay')
      .leftJoinAndSelect('pay.employee', 'employee')
      .where('pay.payrollId = :payrollId', { payrollId })
      .getMany();

    if (!pays) {
      throw new NotFoundException(
        'Not a single pay found for this processed payroll',
      );
    }

    return pays;
  }

  async findPayById(payId: string): Promise<Pay> {
    const pay = await this.payRepository.findOne({ where: { id: payId } });

    const { payroll, employee } = pay;

    console.log('Payroll: ', payroll, 'Employee: ', employee);

    return pay;
  }
}

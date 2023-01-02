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
    const pays = this.payRepository.find({ where: { payrollId } });

    if (!pays) {
      throw new NotFoundException(
        'Not a single pay found for this processed payroll',
      );
    }

    return pays;
  }
}

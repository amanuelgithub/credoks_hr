import { Injectable } from '@nestjs/common';
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
}

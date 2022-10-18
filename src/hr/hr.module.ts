import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hr } from './entities/hr.entity';
import { UsersModule } from 'src/users/users.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hr]), Hr, UsersModule, EmployeesModule],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}

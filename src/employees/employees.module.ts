import { Module } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { PositionsService } from './services/positions.service';
import { Position } from './entities/position.entity';
import { PositionsController } from './controllers/positions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Position]), Employee, Position],
  controllers: [EmployeesController, PositionsController],
  providers: [EmployeesService, PositionsService],
  exports: [EmployeesService],
})
export class EmployeesModule {}

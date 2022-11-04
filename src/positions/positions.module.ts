import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { CaslModule } from 'src/casl/casl.module';
import { DepartmentsModule } from 'src/departments/departments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position]),
    CaslModule,
    DepartmentsModule,
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}

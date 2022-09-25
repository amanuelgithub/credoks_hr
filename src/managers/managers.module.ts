import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './enitities/manager.entity';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manager]), Manager],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}

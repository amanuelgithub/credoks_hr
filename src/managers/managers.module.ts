import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Manager } from './enitities/manager.entity';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manager]), Manager, UsersModule],
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule {}

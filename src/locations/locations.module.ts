import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), CompaniesModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}

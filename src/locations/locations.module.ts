import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), CompaniesModule, CaslModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
import { validationSchema } from './config/env.validation';
import { DB_CONFIG } from './commons/constants';
import { appConfig } from './config/app.config';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/env/${process.env.NODE_ENV}.env`,
      load: Object.values([DatabaseConfig, appConfig]),
      validationSchema: validationSchema,
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get(DB_CONFIG),
      }),
    }),

    CompaniesModule,

    EmployeesModule,

    AuthModule,

    DepartmentsModule,

    LocationsModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './config/env.validation';
import { appConfig } from './config/app.config';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { LocationsModule } from './locations/locations.module';
import { PositionsModule } from './positions/positions.module';
import { PayrollModule } from './payroll/payroll.module';
import { CaslModule } from './casl/casl.module';
import { ReportsModule } from './reports/reports.module';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/stage.${process.env.STAGE}.env`,
      // load: Object.values([DatabaseConfig, appConfig]),
      load: Object.values([appConfig]),
      validationSchema: validationSchema,
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          database: configService.get('DATABASE_NAME'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    CompaniesModule,

    EmployeesModule,

    AuthModule,

    DepartmentsModule,

    LocationsModule,

    PositionsModule,

    PayrollModule,

    CaslModule,

    ReportsModule,

    PayModule,
  ],
})
export class AppModule {}

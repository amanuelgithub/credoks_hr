import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Company } from 'src/companies/entities/company.entity';
import { Department } from 'src/departments/entities/department.entity';
import { EmergencyContact } from 'src/employees/entities/emergency-contact.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Leave } from 'src/employees/entities/leave.entity';
import { Qualification } from 'src/employees/entities/qualification.entity';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';
import { Location } from 'src/locations/entities/location.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { Position } from 'src/positions/entities/position.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects =
  | InferSubjects<
      | typeof Company
      | typeof Department
      | typeof Location
      | typeof Position
      | typeof Payroll
      | typeof Leave
      | typeof Employee
      | typeof EmergencyContact
      | typeof Qualification
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(employee: Employee) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (employee.type === UserTypeEnum.ADMIN) {
      // give full-right over all subjects
      can(Action.Manage, 'all');
    } else if (employee.type === UserTypeEnum.MANAGER) {
    } else if (employee.type === UserTypeEnum.HR) {
    } else if (employee.type === UserTypeEnum.EMPLOYEE) {
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

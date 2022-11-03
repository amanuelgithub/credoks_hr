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
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';
import { QualificationsService } from 'src/employees/services/qualifications.service';
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
      | typeof Employee
      | typeof Leave
      | typeof Payroll
      | typeof QualificationsService
      | typeof EmergencyContact
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    if (user?.type === UserTypeEnum.ADMIN) {
      // gives fullright over-all subjects
      can(Action.Manage, 'all');
    } else if (user?.type === UserTypeEnum.MANAGER) {
      // can only read,create, and update if only employee's company === managers company
      can(Action.Create, Employee, { company: { $eq: user.company } });
      can(Action.Update, Employee, { company: { $eq: user.company } });
      can(Action.Read, Employee, { company: { $eq: user.company } });
      cannot(Action.Delete, Employee);
    } else if (user?.type === UserTypeEnum.HR) {
      // can only read,create, and update if only employee's company === managers company
      can(Action.Read, Employee, { company: { $eq: user.company } });
      can(Action.Create, Employee, { company: { $eq: user.company } });
      can(Action.Update, Employee, { company: { $eq: user.company } });
      cannot(Action.Delete, Employee).because(
        'You are neither hr, manager nor admin...haha :)',
      );
    } else if (user?.type === UserTypeEnum.EMPLOYEE) {
      cannot(Action.Manage, Employee);
      // Employee can only read and update their own informations
      can(Action.Read, Employee, { id: { $eq: user.sub } });
      can(Action.Update, Employee, { id: { $eq: user.sub } });
      cannot(Action.Delete, Employee).because(
        'You are neither hr, manager nor admin...haha :)',
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

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
import { Experience } from 'src/employees/entities/experience.entity';
import { Qualification } from 'src/employees/entities/qualification.entity';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';
import { Location } from 'src/locations/entities/location.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { Position } from 'src/positions/entities/position.entity';
import { SalaryRevision } from '../salary-revision/entities/salary-revision.entity';

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
      | typeof Payroll
      | typeof Qualification
      | typeof EmergencyContact
      | typeof Experience
      | typeof SalaryRevision
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    // console.log('ability factory', user);

    if (user?.type === UserTypeEnum.ADMIN) {
      // gives full-right over-all subjects
      can(Action.Manage, 'all');
    } else if (user?.type === UserTypeEnum.MANAGER) {
      // EMPLOYEE
      // can only read,create, and update if only employee's company === managers company
      can(Action.Create, Employee, { companyId: { $eq: user.companyId } });
      can(Action.Update, Employee, { companyId: { $eq: user.companyId } });
      can(Action.Read, Employee, { companyId: { $eq: user.companyId } });
      cannot(Action.Delete, Employee);

      // DEPARTMENT
      // manager  can create, update and read a department in his/her company
      cannot(Action.Manage, Department);
      can(Action.Create, Department, { companyId: { $eq: user.companyId } });
      can(Action.Update, Department, { companyId: { $eq: user.companyId } });
      can(Action.Read, Department, { companyId: { $eq: user.companyId } });

      // LOCATIONS
      // managers can create, read, update and delete locations in his/her company
      can(Action.Create, Location, { companyId: { $eq: user.companyId } });
      can(Action.Read, Location, { companyId: { $eq: user.companyId } });
      can(Action.Update, Location, { companyId: { $eq: user.companyId } });
      can(Action.Delete, Location, { companyId: { $eq: user.companyId } });

      // POSITIONS -> AKA department positions
      // managers can create, read, update and delete positions in his/her company
      // Note: permission for the different operations are not properly implemented although
      // they work properly
      can(Action.Manage, Position);
      can(Action.Create, Position);
      can(Action.Update, Position);
      can(Action.Read, Position);
      can(Action.Delete, Position);

      // SALARY REVISION
      // manager can approve, view all salary revisions, view all of an
      // employee's salary's salary revisions
      can(Action.Update, SalaryRevision);
      can(Action.Read, SalaryRevision);
    } else if (user?.type === UserTypeEnum.HR) {
      // EMPLOYEE
      // can only read,create, and update if only employee's company === managers company
      can(Action.Read, Employee, { companyId: { $eq: user.companyId } });
      can(Action.Create, Employee, { companyId: { $eq: user.companyId } });
      can(Action.Update, Employee, { companyId: { $eq: user.companyId } });
      cannot(Action.Delete, Employee);

      // DEPARTMENT
      // hr can only read departments of their respective company
      can(Action.Read, Department, { companyId: { $eq: user.companyId } });

      // LOCATIONS
      // hr can only read locations of their respective company
      can(Action.Read, Location, { companyId: { $eq: user.companyId } });

      // EMERGENCY CONTACT INFO
      // hr can create, read, update and delete emergency contact fora an employee
      can(Action.Create, EmergencyContact);
      can(Action.Update, EmergencyContact);
      can(Action.Read, EmergencyContact);
      can(Action.Delete, EmergencyContact);

      // QUALIFICATIONS
      can(Action.Manage, Qualification);
      can(Action.Create, Qualification);
      can(Action.Update, Qualification);
      can(Action.Read, Qualification);
      can(Action.Delete, Qualification);

      // EXPERIENCE
      can(Action.Manage, Experience);
      can(Action.Create, Experience);
      can(Action.Update, Experience);
      can(Action.Read, Experience);

      // SALARY REVISION
      // HR can create, view all and single employee salary revisions information
      can(Action.Create, SalaryRevision);
      can(Action.Read, SalaryRevision);
    } else if (user?.type === UserTypeEnum.EMPLOYEE) {
      // cannot(Action.Manage, Employee);
      // Employee can only read and update their own information
      // can(Action.Read, Employee, { id: { $eq: user.sub } });
      // can(Action.Update, Employee, { id: { $eq: user.sub } });
      // cannot(Action.Delete, Employee).because(
      //   'You are neither hr, manager nor admin...haha :)',
      // );
      // EMERGENCY CONTACT INFO
      // employees can create, read, update and delete their own emergency contact details
      // can(Action.Create, EmergencyContact, { employeeId: { $eq: user.sub } });
      // can(Action.Update, EmergencyContact, { employeeId: { $eq: user.sub } });
      // can(Action.Read, EmergencyContact, { employeeId: { $eq: user.sub } });
      // can(Action.Delete, EmergencyContact, { employeeId: { $eq: user.sub } });
      // QUALIFICATION INFORMATION
      // employees can create, read, update and delete their own qualificaitons
      // can(Action.Create, Qualification, { employeeId: { $eq: user.sub } });
      // can(Action.Update, Qualification, { employeeId: { $eq: user.sub } });
      // can(Action.Read, Qualification, { employeeId: { $eq: user.sub } });
      // can(Action.Delete, Qualification, { employeeId: { $eq: user.sub } });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

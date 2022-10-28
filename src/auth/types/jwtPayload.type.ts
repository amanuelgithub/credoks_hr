import { Company } from 'src/companies/entities/company.entity';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';

export type JWTPayload = {
  sub: string;
  email: string;
  userType:
    | UserTypeEnum.ADMIN
    | UserTypeEnum.EMPLOYEE
    | UserTypeEnum.HR
    | UserTypeEnum.MANAGER;
  company: Company;
};

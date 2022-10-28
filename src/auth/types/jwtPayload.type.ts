import { Company } from 'src/companies/entities/company.entity';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';

export type JWTPayload = {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserTypeEnum;
  company: Company;
};

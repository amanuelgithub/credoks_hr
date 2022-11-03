import { UserTypeEnum } from 'src/employees/enums/user-type.enum';

export type JWTPayload = {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  type: UserTypeEnum;
  companyId: string;
};

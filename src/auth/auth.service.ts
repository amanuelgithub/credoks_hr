import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';
import { jwtConstants } from './constants';
import { JWTPayload } from './types/jwtPayload.type';
import { EmployeesService } from 'src/employees/services/employees.service';
import { UpdateEmployeeDto } from 'src/employees/dto/update-employee.dto';
import { Employee } from 'src/employees/entities/employee.entity';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async login(employee: Employee): Promise<Tokens> {
    if (!employee) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      employee.id,
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.type,
      employee.company,
    );
    await this.updateRtHash(employee.id, tokens.refresh_token);

    return tokens;
  }

  async logout(employeeId: string): Promise<boolean> {
    const employee = await this.employeesService.findOne(employeeId);
    await this.employeesService.update(employee.id, {
      hashedRt: null,
    } as UpdateEmployeeDto);

    return true;
  }

  async refreshTokens(employeeId: string, rt: string): Promise<Tokens> {
    const employee = await this.employeesService.findOne(employeeId);
    if (!employee || !employee.hashedRt)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, employee.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      employee.id,
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.type,
      employee.company,
    );
    await this.updateRtHash(employee.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(employeeId: string, rt: string): Promise<void> {
    // salting and hash refresh token
    const salt = await bcrypt.genSalt();
    const hashedRt = await bcrypt.hash(rt, salt);

    await this.employeesService.update(employeeId, {
      hashedRt,
    } as UpdateEmployeeDto);
  }

  async getTokens(
    employeeId: string,
    firstName: string,
    lastName: string,
    email: string,
    userType: UserTypeEnum,
    company: Company,
  ): Promise<Tokens> {
    const jwtPayload: JWTPayload = {
      sub: employeeId,
      firstName,
      lastName,
      email,
      userType,
      company,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConstants.AT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConstants.RT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  // used by the local.strategy.ts
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.employeesService.findEmployeeByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

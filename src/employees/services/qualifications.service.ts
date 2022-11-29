import { ForbiddenError } from '@casl/ability';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Repository } from 'typeorm';
import { CreateQualificationDto } from '../dto/create-qualification.dto';
import { UpdateQualificationDto } from '../dto/update-qualification.dto';
import { Qualification } from '../entities/qualification.entity';
import { UserTypeEnum } from '../enums/user-type.enum';
import { EmployeesService } from './employees.service';

@Injectable()
export class QualificationsService {
  constructor(
    @InjectRepository(Qualification)
    private qualificationsRepository: Repository<Qualification>,
    private employeesService: EmployeesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createQualificationForEmployee(
    requester: any,
    employeeId: string,
    createQualificationDto: CreateQualificationDto,
  ): Promise<Qualification> {
    const { education } = createQualificationDto;

    if (await this.qualificationExistsWithSameName(education)) {
      throw new ConflictException('Qualification already exists');
    }

    const employee = await this.employeesService.findEmployeeById(employeeId);

    const qualification = this.qualificationsRepository.create(
      createQualificationDto,
    );

    qualification.employee = employee;

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('you are not allowed to perform this action')
        .throwUnlessCan(Action.Create, qualification);

      const createdQualification = await this.qualificationsRepository.save(
        qualification,
      );

      const { employee, employeeId, createdAt, updatedAt, ...remaining } =
        createdQualification;

      return remaining as Qualification;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async findQualificationByEmployeeId(
    requester: any,
    employeeId: string,
  ): Promise<Qualification[]> {
    if (
      requester.type === UserTypeEnum.EMPLOYEE &&
      requester.sub !== employeeId
    ) {
      throw new ForbiddenException(
        'You are not allowed to view other employee qualifications.',
      );
    }

    const qualifications = await this.qualificationsRepository
      .createQueryBuilder('qualification')
      .select('qualification.id')
      .addSelect('qualification.education')
      .addSelect('qualification.school')
      .addSelect('qualification.educationStartedYear')
      .addSelect('qualification.educationEndedYear')
      .where('qualification.employeeId = :employeeId', { employeeId })
      .getMany();

    if (!qualifications) {
      throw new NotFoundException('Qualifications not found');
    }

    return qualifications;
  }

  async findQualification(
    requester: any,
    qualificationId: string,
  ): Promise<Qualification> {
    const qualification = await this.qualificationsRepository
      .createQueryBuilder('qualification')
      .select('qualification.id')
      .addSelect('qualification.education')
      .addSelect('qualification.school')
      .addSelect('qualification.educationStartedYear')
      .addSelect('qualification.educationEndedYear')
      .where('qualification.id = :qualificationId', { qualificationId })
      .getOne();

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    if (!qualification) {
      throw new NotFoundException('Qualification not found');
    }

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to view this Qualification')
        .throwUnlessCan(Action.Read, qualification);

      return qualification;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async updateQualification(
    requester: any,
    qualificationId: string,
    updateQualificationDto: UpdateQualificationDto,
  ): Promise<Qualification> {
    const qualification = await this.findQualification(
      requester,
      qualificationId,
    );

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    const { education, educationEndedYear, educationStartedYear } =
      updateQualificationDto;

    if (await this.qualificationExistsWithSameName(education)) {
      throw new ConflictException('Qualification already exists');
    }

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to modify this qualification')
        .throwUnlessCan(Action.Update, qualification);

      qualification.education = education;
      qualification.educationEndedYear = educationEndedYear;
      qualification.educationStartedYear = educationStartedYear;

      return await this.qualificationsRepository.save(qualification);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async remove(qualificationId: string): Promise<void> {
    const result = await this.qualificationsRepository.delete({
      id: qualificationId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Qualification Not Found!');
    }
  }

  // util functions //
  async qualificationExistsWithSameName(education: string): Promise<boolean> {
    const qualification = await this.qualificationsRepository.findOne({
      where: { education },
    });

    return qualification ? true : false;
  }
}

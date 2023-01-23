import { ForbiddenError } from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Repository } from 'typeorm';
import { CreateExperienceDto } from '../dto/create-experience.dto';
import { Experience } from '../entities/experience.entity';
import { UserTypeEnum } from '../enums/user-type.enum';
import { EmployeesService } from './employees.service';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private experiencesRepository: Repository<Experience>,
    private employeeService: EmployeesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createExperienceForEmployee(
    requester: any,
    employeeId: string,
    createExperienceDto: CreateExperienceDto,
  ): Promise<Experience> {
    const employee = await this.employeeService.findEmployeeById(employeeId);

    const experience = this.experiencesRepository.create(createExperienceDto);

    experience.employee = employee;

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('you are not allowed to perform this action')
        .throwUnlessCan(Action.Create, Experience);

      const createdExperiece = await this.experiencesRepository.save(
        experience,
      );

      const { createdAt, updatedAt, employee, ...remaining } = createdExperiece;

      return remaining as Experience;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async findExperienceByEmployeeId(
    requester: any,
    employeeId: string,
  ): Promise<Experience[]> {
    if (
      requester.type === UserTypeEnum.EMPLOYEE &&
      requester.sub !== employeeId
    ) {
      throw new ForbiddenException(
        'You are not allowed to view other employee experiences.',
      );
    }

    const experiences = await this.experiencesRepository
      .createQueryBuilder('experiences')
      .select('experiences.id')
      .addSelect('experiences.jobTitle')
      .addSelect('experiences.companyName')
      .addSelect('experiences.from')
      .addSelect('experiences.to')
      .where('experiences.employeeId = :employeeId', { employeeId })
      .getMany();

    if (!experiences) {
      throw new NotFoundException('Experiences not found');
    }

    return experiences;
  }
  async remove(experienceId: string): Promise<void> {
    const result = await this.experiencesRepository.delete({
      id: experienceId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Experience Not Found!');
    }
  }
}

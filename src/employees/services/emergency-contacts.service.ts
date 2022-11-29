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
import { CreateEmergencyContactDto } from '../dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from '../dto/update-emergency-contact.dto';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { EmployeesService } from './employees.service';

@Injectable()
export class EmergencyContactsService {
  constructor(
    @InjectRepository(EmergencyContact)
    private emergencyContactsRepository: Repository<EmergencyContact>,
    private employeesService: EmployeesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createEmergencyContactForEmployee(
    requester: any,
    employeeId: string,
    createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    const { phone } = createEmergencyContactDto;

    if (await this.emergencyContactExistWithSamePhone(phone)) {
      throw new ConflictException(
        'Emergency Contact with same phone already exists!',
      );
    }

    const employee = await this.employeesService.findEmployeeById(employeeId);

    const emergencyContact = this.emergencyContactsRepository.create(
      createEmergencyContactDto,
    );

    emergencyContact.employee = employee;

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to perform this action!')
        .throwUnlessCan(Action.Create, emergencyContact);

      const { employee, employeeId, createAt, updatedAt, ...remaining } =
        await this.emergencyContactsRepository.save(emergencyContact);

      return remaining as EmergencyContact;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException();
      }
    }
  }

  async findEmergencyContactsByEmployeeId(
    employeeId: string,
  ): Promise<EmergencyContact[]> {
    const emergencyContacts = await this.emergencyContactsRepository
      .createQueryBuilder('emergency_contact')
      .select('emergency_contact.id')
      .addSelect('emergency_contact.id')
      .addSelect('emergency_contact.firstName')
      .addSelect('emergency_contact.lastName')
      .addSelect('emergency_contact.phone')
      .addSelect('emergency_contact.relation')
      .where('emergency_contact.employeeId = :employeeId', { employeeId })
      .getMany();

    if (!emergencyContacts) {
      throw new NotFoundException('Emergency contacts not found!');
    }

    return emergencyContacts;
  }

  async findEmergencyContactById(ecId: string): Promise<EmergencyContact> {
    const emergencyContact = await this.emergencyContactsRepository
      .createQueryBuilder('emergency_contact')
      .select('emergency_contact.id')
      .addSelect('emergency_contact.id')
      .addSelect('emergency_contact.firstName')
      .addSelect('emergency_contact.lastName')
      .addSelect('emergency_contact.phone')
      .addSelect('emergency_contact.relation')
      .where('emergency_contact.id = :ecId', { ecId })
      .getOne();

    if (!emergencyContact) {
      throw new NotFoundException('Emergency contact not found!');
    }

    return emergencyContact;
  }

  async update(
    ecId: string,
    updateEmergencyContactDto: UpdateEmergencyContactDto,
  ) {
    const emergencyContact = await this.findEmergencyContactById(ecId);

    const { firstName, lastName, phone, relation } = updateEmergencyContactDto;

    emergencyContact.firstName = firstName;
    emergencyContact.lastName = lastName;
    emergencyContact.phone = phone;
    emergencyContact.relation = relation;

    return this.emergencyContactsRepository.save(emergencyContact);
  }

  async remove(ecId: string): Promise<void> {
    const result = await this.emergencyContactsRepository.delete({ id: ecId });
    if (result.affected === 0) {
      throw new NotFoundException('Emergency contact Not Found!');
    }
  }

  // utile functions //
  async emergencyContactExistWithSamePhone(phone: string): Promise<boolean> {
    const emergencyContact = await this.emergencyContactsRepository.findOne({
      where: { phone },
    });

    return emergencyContact ? true : false;
  }
}

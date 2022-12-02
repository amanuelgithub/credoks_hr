import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmergencyContactsService } from '../services/emergency-contacts.service';
import { CreateEmergencyContactDto } from '../dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from '../dto/update-emergency-contact.dto';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';

@Controller('emergency-contacts')
export class EmergencyContactsController {
  constructor(
    private readonly emergencyContactsService: EmergencyContactsService,
  ) {}

  @Post(':employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, EmergencyContact),
  )
  createEmergencyContact(
    @Req() req,
    @Param('employeeId') employeeId: string,
    @Body() createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    console.log('EmergencyContact created => ', createEmergencyContactDto);
    return this.emergencyContactsService.createEmergencyContactForEmployee(
      req.user,
      employeeId,
      createEmergencyContactDto,
    );
  }

  @Get('/employee/:employeeId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, EmergencyContact),
  )
  findEmergencyContactsOfEmployee(
    @Param('employeeId') employeeId: string,
  ): Promise<EmergencyContact[]> {
    return this.emergencyContactsService.findEmergencyContactsByEmployeeId(
      employeeId,
    );
  }

  @Get(':ecId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, EmergencyContact),
  )
  async findEmergencyContact(
    @Param('ecId') ecId: string,
  ): Promise<EmergencyContact> {
    return this.emergencyContactsService.findEmergencyContactById(ecId);
  }

  @Patch(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, EmergencyContact),
  )
  async update(
    @Param('ecId') ecId: string,
    @Body() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    return this.emergencyContactsService.update(
      ecId,
      updateEmergencyContactDto,
    );
  }

  @Delete(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, EmergencyContact),
  )
  remove(@Param('id') id: string): Promise<void> {
    return this.emergencyContactsService.remove(id);
  }
}

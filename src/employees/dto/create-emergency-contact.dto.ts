import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RelationEnum } from '../enums/relation.enum';

export class CreateEmergencyContactDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(RelationEnum)
  relation: RelationEnum;

  @IsNotEmpty()
  @IsString()
  employeeId: string;
}

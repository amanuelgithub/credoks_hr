import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RelationEnum } from '../enums/relation.enum';

export class UpdateEmergencyContactDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(RelationEnum)
  relation: RelationEnum;
}

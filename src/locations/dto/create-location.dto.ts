import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsOptional()
  specificLocationName?: string;
}

import { IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  city: string;

  @IsOptional()
  region: string;

  @IsOptional()
  woreda: string;

  @IsOptional()
  specificLocationName?: string;
}

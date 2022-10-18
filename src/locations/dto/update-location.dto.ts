import { IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  country: string;

  @IsOptional()
  city: string;
}

import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;
}

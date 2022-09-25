import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Manager } from './enitities/manager.entity';
import { ManagersService } from './managers.service';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  create(@Body() createManagerDto: CreateManagerDto): Promise<Manager> {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  findAll(): Promise<Manager[]> {
    return this.managersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Manager> {
    return this.managersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManagerDto: UpdateManagerDto,
  ): Promise<Manager> {
    return this.managersService.update(id, updateManagerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managersService.remove(id);
  }
}

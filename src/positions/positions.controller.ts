import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { Position } from './entities/position.entity';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Position> {
    return this.positionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.positionsService.remove(id);
  }
}

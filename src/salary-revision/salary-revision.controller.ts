import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalaryRevisionService } from './salary-revision.service';
import { CreateSalaryRevisionDto } from './dto/create-salary-revision.dto';
import { ApproveSalaryRevisionDto } from './dto/approve-salary-revision.dto';
import { SalaryRevision } from './entities/salary-revision.entity';

@Controller('salary-revision')
export class SalaryRevisionController {
  constructor(private readonly salaryRevisionService: SalaryRevisionService) {}

  @Post('/make')
  create(@Body() createSalaryRevisionDto: CreateSalaryRevisionDto) {
    return this.salaryRevisionService.create(createSalaryRevisionDto);
  }

  @Patch('/approve')
  approve(
    @Param('id') id: string,
    @Body() approveSalaryRevisionDto: ApproveSalaryRevisionDto,
  ) {
    return this.salaryRevisionService.approve(id, approveSalaryRevisionDto);
  }

  @Get()
  findAll() {
    return this.salaryRevisionService.findAll();
  }

  @Get('/employee/:employeeId')
  findEmployeeSalaryRevisions(
    @Param('employeeId') employeeId: string,
  ): Promise<SalaryRevision[]> {
    return this.salaryRevisionService.findEmployeeSalaryRevisions(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryRevisionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salaryRevisionService.remove(+id);
  }
}

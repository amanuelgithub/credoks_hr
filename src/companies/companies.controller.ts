import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { AtGuard } from 'src/auth/guards/at.guard';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * used to store the uploaded company logo to the
 * destination folder specified
 */
export const storageCompanyLogo = {
  storage: diskStorage({
    destination: './uploads/companiesLogos',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Company))
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Company))
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  // @UseGuards(AtGuard, PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Company))
  findOne(@Param('id') id: string): Promise<Company> {
    console.log('find one company hitted: ', id);
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Company))
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Company))
  remove(@Param('id') id: string): Promise<void> {
    return this.companiesService.remove(id);
  }

  @Patch(':companyId/upload-logo')
  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('file', storageCompanyLogo))
  uploadCompanyLogo(
    @Param('companyId') companyId: string,
    @UploadedFile() file,
  ) {
    return this.companiesService.uploadCompanyLogo(companyId, {
      logo: file.filename,
    });
  }

  @Get('companies-logos/:imagename')
  // @UseGuards(AtGuard)
  findProfileImage(
    @Param('imagename') imagename,
    @Response() res,
  ): Promise<any> {
    return res.sendFile(
      join(process.cwd(), 'uploads/companiesLogos/' + imagename),
    );
  }
}

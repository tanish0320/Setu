import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AffiliationsService } from './affiliations.service';
import { CreateAffiliationDto } from './dto/create-affiliation.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';
import { QueryAffiliationDto } from './dto/query-affiliation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Affiliations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('affiliations')
export class AffiliationsController {
  constructor(private readonly affiliationsService: AffiliationsService) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('affiliations:create')
  @ApiOperation({ summary: 'Create a new doctor-hospital affiliation' })
  @ApiResponse({ status: 201, description: 'Affiliation created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() createAffiliationDto: CreateAffiliationDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.affiliationsService.create(createAffiliationDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('affiliations:read')
  @ApiOperation({ summary: 'Get list of affiliations (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list of affiliations.' })
  async findAll(@Query() query: QueryAffiliationDto) {
    return this.affiliationsService.findAll(query);
  }

  @Get(':id')
  @Permissions('affiliations:read')
  @ApiOperation({ summary: 'Get affiliation details by ID' })
  @ApiResponse({ status: 200, description: 'Affiliation details.' })
  @ApiResponse({ status: 404, description: 'Affiliation not found.' })
  async findOne(@Param('id') id: string) {
    return this.affiliationsService.findOne(id);
  }

  @Put(':id')
  @Permissions('affiliations:update')
  @ApiOperation({ summary: 'Update affiliation' })
  @ApiResponse({ status: 200, description: 'Affiliation updated successfully.' })
  @ApiResponse({ status: 404, description: 'Affiliation not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAffiliationDto: UpdateAffiliationDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.affiliationsService.update(id, updateAffiliationDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('affiliations:delete')
  @ApiOperation({ summary: 'Delete affiliation' })
  @ApiResponse({ status: 200, description: 'Affiliation deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Affiliation not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.affiliationsService.remove(id, this.getActor(user, req));
  }
}

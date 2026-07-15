import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmergenciesService } from './emergencies.service';
import { EscalationService } from './escalation.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { QueryEmergencyDto } from './dto/query-emergency.dto';
import { AcceptEmergencyDto } from './dto/accept-emergency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Emergencies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('emergencies')
export class EmergenciesController {
  constructor(
    private readonly emergenciesService: EmergenciesService,
    private readonly escalationService: EscalationService,
  ) {}

  private getActor(user: any, req: any): AuditActor {
    return {
      name: user?.name,
      role: user?.role?.name,
      ip: req?.ip,
      device: req?.headers?.['user-agent'],
    };
  }

  @Post()
  @Permissions('emergencies:create')
  @ApiOperation({ summary: 'Create a new emergency request, rank doctors, and alert Rank #1' })
  @ApiResponse({ status: 201, description: 'Emergency request created and alert workflow initiated.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  async create(
    @Body() createEmergencyDto: CreateEmergencyDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.emergenciesService.create(createEmergencyDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('emergencies:read')
  @ApiOperation({ summary: 'Get a paginated and filtered list of emergency requests' })
  @ApiResponse({ status: 200, description: 'List of emergency requests.' })
  async findAll(@Query() queryEmergencyDto: QueryEmergencyDto) {
    return this.emergenciesService.findAll(queryEmergencyDto);
  }

  @Post('check-escalations')
  @Permissions('emergencies:escalate')
  @HttpCode(200)
  @ApiOperation({ summary: 'Manually run checkEscalations to timeout and escalate pending alerts' })
  @ApiResponse({ status: 200, description: 'Escalations checked successfully.' })
  async triggerEscalations() {
    await this.escalationService.checkEscalations();
    return { message: 'Escalation check triggered successfully' };
  }

  @Get(':id')
  @Permissions('emergencies:read')
  @ApiOperation({ summary: 'Get details of a specific emergency request including timeline, assignments, and escalations' })
  @ApiResponse({ status: 200, description: 'Emergency request details.' })
  @ApiResponse({ status: 404, description: 'Emergency request not found.' })
  async findOne(@Param('id') id: string) {
    return this.emergenciesService.findOne(id);
  }

  @Patch(':id/accept')
  @Permissions('emergencies:accept')
  @ApiOperation({ summary: 'Accept an active emergency request assignment (Doctor only)' })
  @ApiResponse({ status: 200, description: 'Emergency request accepted.' })
  @ApiResponse({ status: 400, description: 'Bad request or active alert not found.' })
  async accept(
    @Param('id') id: string,
    @Body() acceptEmergencyDto: AcceptEmergencyDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.emergenciesService.accept(id, acceptEmergencyDto, user, this.getActor(user, req));
  }

  @Patch(':id/decline')
  @Permissions('emergencies:decline')
  @ApiOperation({ summary: 'Decline an active emergency request assignment and escalate immediately (Doctor only)' })
  @ApiResponse({ status: 200, description: 'Emergency request declined and next escalation triggered.' })
  @ApiResponse({ status: 400, description: 'Bad request or active alert not found.' })
  async decline(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.emergenciesService.decline(id, user, this.getActor(user, req));
  }

  @Patch(':id/cancel')
  @Permissions('emergencies:cancel')
  @ApiOperation({ summary: 'Cancel an active emergency request' })
  @ApiResponse({ status: 200, description: 'Emergency request cancelled.' })
  @ApiResponse({ status: 400, description: 'Cannot cancel emergency request in completed or cancelled states.' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.emergenciesService.cancel(id, this.getActor(user, req));
  }

  @Patch(':id/complete')
  @Permissions('emergencies:create') // Creator of the request (e.g. Hospital coordinator) or admin can complete
  @ApiOperation({ summary: 'Complete an active emergency request' })
  @ApiResponse({ status: 200, description: 'Emergency request completed.' })
  @ApiResponse({ status: 400, description: 'Cannot complete request unless accepted or travelling.' })
  async complete(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.emergenciesService.complete(id, this.getActor(user, req));
  }

  @Get(':id/escalation')
  @Permissions('emergencies:read')
  @ApiOperation({ summary: 'Get escalation logs for a specific emergency request' })
  @ApiResponse({ status: 200, description: 'List of escalation logs.' })
  @ApiResponse({ status: 404, description: 'Emergency request not found.' })
  async getEscalations(@Param('id') id: string) {
    return this.emergenciesService.getEscalationLogs(id);
  }
}

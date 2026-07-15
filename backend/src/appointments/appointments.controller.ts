import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CalendarService } from './calendar.service';
import { SlotSuggestionService } from './slot-suggestion.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { PreviewConflictsDto } from './dto/preview-conflicts.dto';
import { GetSuggestionsDto } from './dto/get-suggestions.dto';
import { GetCalendarDto } from './dto/get-calendar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditActor } from '../audit-log/audit-log.service';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly calendarService: CalendarService,
    private readonly slotSuggestionService: SlotSuggestionService,
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
  @Permissions('appointments:create')
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or scheduling conflicts.' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.appointmentsService.create(createAppointmentDto, this.getActor(user, req));
  }

  @Get()
  @Permissions('appointments:read')
  @ApiOperation({ summary: 'Get list of appointments (filtered, paginated, sorted)' })
  @ApiResponse({ status: 200, description: 'Return paginated list of appointments.' })
  async findAll(@Query() query: QueryAppointmentDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get('conflicts')
  @Permissions('appointments:read')
  @ApiOperation({ summary: 'Preview conflicts for a hypothetical appointment slot' })
  @ApiResponse({ status: 200, description: 'List of conflicts if any.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async previewConflicts(@Query() query: PreviewConflictsDto) {
    return this.appointmentsService.previewConflicts(query);
  }

  @Get('calendar')
  @Permissions('appointments:read')
  @ApiOperation({ summary: 'Get calendar view of appointments (daily, weekly, monthly)' })
  @ApiResponse({ status: 200, description: 'Return calendar view with appointments.' })
  async getCalendar(@Query() query: GetCalendarDto) {
    return this.calendarService.getCalendar(query);
  }

  @Get('suggestions')
  @Permissions('appointments:read')
  @ApiOperation({ summary: 'Get next 5 available slot suggestions for a doctor at a hospital' })
  @ApiResponse({ status: 200, description: 'Return next 5 available slot suggestions.' })
  async getSuggestions(@Query() query: GetSuggestionsDto) {
    return this.slotSuggestionService.getSuggestions(query);
  }

  @Get(':id')
  @Permissions('appointments:read')
  @ApiOperation({ summary: 'Get appointment details by ID' })
  @ApiResponse({ status: 200, description: 'Appointment details.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('appointments:update')
  @ApiOperation({ summary: 'Update/Reschedule/Status change of an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or status transition violation.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, this.getActor(user, req));
  }

  @Delete(':id')
  @Permissions('appointments:delete')
  @ApiOperation({ summary: 'Soft delete an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.appointmentsService.remove(id, this.getActor(user, req));
  }
}

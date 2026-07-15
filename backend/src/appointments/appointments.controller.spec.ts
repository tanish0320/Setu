import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CalendarService } from './calendar.service';
import { SlotSuggestionService } from './slot-suggestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let appointmentsService: jest.Mocked<AppointmentsService>;
  let calendarService: jest.Mocked<CalendarService>;
  let slotSuggestionService: jest.Mocked<SlotSuggestionService>;

  beforeEach(async () => {
    const mockAppointmentsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      previewConflicts: jest.fn(),
    };

    const mockCalendarService = {
      getCalendar: jest.fn(),
    };

    const mockSlotSuggestionService = {
      getSuggestions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
        { provide: CalendarService, useValue: mockCalendarService },
        { provide: SlotSuggestionService, useValue: mockSlotSuggestionService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    appointmentsService = module.get(AppointmentsService);
    calendarService = module.get(CalendarService);
    slotSuggestionService = module.get(SlotSuggestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call appointmentsService.create', async () => {
      const dto: any = { doctorId: 'doc-1' };
      const user = { name: 'Admin', role: { name: 'Super Admin' } };
      const req = { ip: '127.0.0.1', headers: {} };
      await controller.create(dto, user, req);
      expect(appointmentsService.create).toHaveBeenCalledWith(dto, expect.any(Object));
    });
  });

  describe('findAll', () => {
    it('should call appointmentsService.findAll', async () => {
      const query = { page: 1, limit: 10 };
      await controller.findAll(query);
      expect(appointmentsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getCalendar', () => {
    it('should call calendarService.getCalendar', async () => {
      const query: any = { view: 'day' };
      await controller.getCalendar(query);
      expect(calendarService.getCalendar).toHaveBeenCalledWith(query);
    });
  });

  describe('getSuggestions', () => {
    it('should call slotSuggestionService.getSuggestions', async () => {
      const query = { doctorId: 'doc-1', hospitalId: 'hosp-1', duration: 30, targetDate: '2026-07-15' };
      await controller.getSuggestions(query);
      expect(slotSuggestionService.getSuggestions).toHaveBeenCalledWith(query);
    });
  });
});

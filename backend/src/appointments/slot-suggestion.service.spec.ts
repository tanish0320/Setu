import { Test, TestingModule } from '@nestjs/testing';
import { SlotSuggestionService } from './slot-suggestion.service';
import { AppointmentsRepository } from './appointments.repository';
import { TravelService } from './travel/travel.service';
import { NotFoundException } from '@nestjs/common';

describe('SlotSuggestionService', () => {
  let service: SlotSuggestionService;
  let repo: any;
  let travelService: any;

  beforeEach(async () => {
    const mockRepo = {
      findAffiliation: jest.fn(),
      findAvailabilityWindows: jest.fn(),
      findDoctorAppointmentsForDay: jest.fn(),
      findDoctorById: jest.fn(),
    };

    const mockTravelService = {
      getTravelTimeBetweenHospitals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotSuggestionService,
        { provide: AppointmentsRepository, useValue: mockRepo },
        { provide: TravelService, useValue: mockTravelService },
      ],
    }).compile();

    service = module.get<SlotSuggestionService>(SlotSuggestionService);
    repo = module.get<AppointmentsRepository>(AppointmentsRepository);
    travelService = module.get<TravelService>(TravelService);
  });

  it('should throw NotFoundException if doctor has no active affiliation', async () => {
    repo.findAffiliation.mockResolvedValue(null);
    const query = { doctorId: 'doc-1', hospitalId: 'hosp-1', duration: 30, targetDate: '2026-07-15' };

    await expect(service.getSuggestions(query)).rejects.toThrow(NotFoundException);
  });

  it('should return empty list if no availability windows exist', async () => {
    repo.findAffiliation.mockResolvedValue({ id: 'aff-1' });
    repo.findAvailabilityWindows.mockResolvedValue([]);
    const query = { doctorId: 'doc-1', hospitalId: 'hosp-1', duration: 30, targetDate: '2026-07-15' };

    const suggestions = await service.getSuggestions(query);
    expect(suggestions).toEqual([]);
  });

  it('should generate Green slots if no surrounding appointments exist', async () => {
    repo.findAffiliation.mockResolvedValue({ id: 'aff-1' });
    repo.findAvailabilityWindows.mockResolvedValue([
      { startTime: '09:00', endTime: '10:00' },
    ]);
    repo.findDoctorAppointmentsForDay.mockResolvedValue([]);
    repo.findDoctorById.mockResolvedValue({ defaultBuffer: 5 });

    const query = { doctorId: 'doc-1', hospitalId: 'hosp-1', duration: 30, targetDate: '2026-07-15' };

    const suggestions = await service.getSuggestions(query);

    // From 09:00 to 10:00 with 30 min duration, step is 15 mins.
    // Slots can start at 09:00, 09:15, 09:30.
    expect(suggestions.length).toBe(3);
    expect(suggestions[0].confidence).toBe('Green');
    expect(suggestions[0].reason).toContain('No surrounding appointments');
  });

  it('should evaluate slot confidence and filter overlapping slots', async () => {
    repo.findAffiliation.mockResolvedValue({ id: 'aff-1' });
    repo.findAvailabilityWindows.mockResolvedValue([
      { startTime: '09:00', endTime: '11:00' },
    ]);
    repo.findDoctorById.mockResolvedValue({ defaultBuffer: 5 });

    // Existing appointment: 09:30 - 10:00 (this should overlap/disqualify some slots)
    const existing = [
      {
        id: 'appt-existing',
        scheduledStart: new Date('2026-07-15T09:30:00'),
        scheduledEnd: new Date('2026-07-15T10:00:00'),
        hospitalId: 'hosp-1',
      },
    ];
    repo.findDoctorAppointmentsForDay.mockResolvedValue(existing);
    travelService.getTravelTimeBetweenHospitals.mockResolvedValue(0); // Same hospital

    const query = { doctorId: 'doc-1', hospitalId: 'hosp-1', duration: 30, targetDate: '2026-07-15' };
    const suggestions = await service.getSuggestions(query);

    // Candidates:
    // 09:00 - 09:30 -> Gap after is 09:30 - 09:30 = 0m. (Since travel + buffer = 0 + 5 = 5m, this is invalid, gap after (0m) < required (5m)!)
    // Let's verify other slots. E.g. slot starting at 10:00 - 10:30. Gap before is 10:00 - 10:00 = 0m. Invalid!
    // Slot starting at 10:15 - 10:45. Gap before is 10:15 - 10:00 = 15m. Required is 5m. Gap is 15 - 5 = 10m. This is Red!
    // Slot starting at 10:30 - 11:00. Gap before is 10:30 - 10:00 = 30m. Required is 5m. Gap is 30 - 5 = 25m. This is Amber!
    expect(suggestions.some(s => s.confidence === 'Red')).toBe(true);
    expect(suggestions.some(s => s.confidence === 'Amber')).toBe(true);
  });
});

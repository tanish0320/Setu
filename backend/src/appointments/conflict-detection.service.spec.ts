import { Test, TestingModule } from '@nestjs/testing';
import { ConflictDetectionService } from './conflict-detection.service';
import { AppointmentsRepository } from './appointments.repository';
import { TravelService } from './travel/travel.service';

describe('ConflictDetectionService', () => {
  let service: ConflictDetectionService;
  let repo: any;
  let travelService: any;

  beforeEach(async () => {
    const mockRepo = {
      findAffiliation: jest.fn(),
      findAvailabilityWindows: jest.fn(),
      findDoctorById: jest.fn(),
      findDoctorAppointmentsForDay: jest.fn(),
    };

    const mockTravelService = {
      getTravelTimeBetweenHospitals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConflictDetectionService,
        { provide: AppointmentsRepository, useValue: mockRepo },
        { provide: TravelService, useValue: mockTravelService },
      ],
    }).compile();

    service = module.get<ConflictDetectionService>(ConflictDetectionService);
    repo = module.get<AppointmentsRepository>(AppointmentsRepository);
    travelService = module.get<TravelService>(TravelService);
  });

  it('should detect AFFILIATION_VIOLATION if doctor is not affiliated', async () => {
    repo.findAffiliation.mockResolvedValue(null);
    repo.findDoctorById.mockResolvedValue({ defaultBuffer: 10 });
    repo.findDoctorAppointmentsForDay.mockResolvedValue([]);

    const conflicts = await service.checkConflicts(
      'doc-1',
      'hosp-1',
      new Date('2026-07-15T09:00:00Z'),
      new Date('2026-07-15T09:30:00Z'),
    );

    expect(conflicts).toContainEqual(
      expect.objectContaining({
        type: 'AFFILIATION_VIOLATION',
      }),
    );
  });

  it('should detect AVAILABILITY_VIOLATION if proposed slot is outside active windows', async () => {
    repo.findAffiliation.mockResolvedValue({ id: 'aff-1' });
    repo.findAvailabilityWindows.mockResolvedValue([
      { startTime: '10:00', endTime: '12:00' }, // Proposed is 09:00 - 09:30
    ]);
    repo.findDoctorById.mockResolvedValue({ defaultBuffer: 10 });
    repo.findDoctorAppointmentsForDay.mockResolvedValue([]);

    // 2026-07-15 is Wednesday (getDay() = 3)
    const conflicts = await service.checkConflicts(
      'doc-1',
      'hosp-1',
      new Date('2026-07-15T09:00:00'), // Local time
      new Date('2026-07-15T09:30:00'), // Local time
    );

    expect(conflicts).toContainEqual(
      expect.objectContaining({
        type: 'AVAILABILITY_VIOLATION',
      }),
    );
  });

  it('should detect OVERLAP conflicts with overlapping appointments', async () => {
    repo.findAffiliation.mockResolvedValue({ id: 'aff-1' });
    repo.findAvailabilityWindows.mockResolvedValue([
      { startTime: '09:00', endTime: '17:00' },
    ]);
    repo.findDoctorById.mockResolvedValue({ defaultBuffer: 10 });

    const existingAppt = {
      id: 'existing-1',
      scheduledStart: new Date('2026-07-15T09:15:00Z'),
      scheduledEnd: new Date('2026-07-15T09:45:00Z'),
      hospitalId: 'hosp-1',
      hospital: { name: 'Hospital 1' },
    };
    repo.findDoctorAppointmentsForDay.mockResolvedValue([existingAppt]);

    const conflicts = await service.checkConflicts(
      'doc-1',
      'hosp-1',
      new Date('2026-07-15T09:00:00Z'),
      new Date('2026-07-15T09:30:00Z'),
    );

    expect(conflicts).toContainEqual(
      expect.objectContaining({
        type: 'OVERLAP',
        details: { appointmentId: 'existing-1' },
      }),
    );
  });

  it('should detect TRAVEL_OVERLAP and BUFFER_VIOLATION for travel and buffers', async () => {
    repo.findAffiliation.mockResolvedValue({ id: 'aff-1' });
    repo.findAvailabilityWindows.mockResolvedValue([
      { startTime: '08:00', endTime: '17:00' },
    ]);
    repo.findDoctorById.mockResolvedValue({ defaultBuffer: 15 });

    const predAppt = {
      id: 'pred-1',
      scheduledStart: new Date('2026-07-15T08:00:00Z'),
      scheduledEnd: new Date('2026-07-15T08:45:00Z'),
      hospitalId: 'hosp-2', // Different hospital
      hospital: { name: 'Hospital 2' },
    };
    repo.findDoctorAppointmentsForDay.mockResolvedValue([predAppt]);
    travelService.getTravelTimeBetweenHospitals.mockResolvedValue(30); // 30 minutes travel time

    // Gap between pred.end (08:45) and proposed.start (09:00) is 15 minutes.
    // Travel time is 30 minutes, so this is a travel overlap and buffer violation!
    const conflicts = await service.checkConflicts(
      'doc-1',
      'hosp-1',
      new Date('2026-07-15T09:00:00Z'),
      new Date('2026-07-15T09:30:00Z'),
    );

    expect(conflicts).toContainEqual(
      expect.objectContaining({
        type: 'TRAVEL_OVERLAP',
      }),
    );
    expect(conflicts).toContainEqual(
      expect.objectContaining({
        type: 'BUFFER_VIOLATION',
      }),
    );
  });
});

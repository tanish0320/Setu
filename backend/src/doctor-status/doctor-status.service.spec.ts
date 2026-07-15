import { Test, TestingModule } from '@nestjs/testing';
import { DoctorStatusService } from './doctor-status.service';
import { DoctorStatusRepository } from './doctor-status.repository';
import { TravelService } from '../appointments/travel/travel.service';
import { DoctorStatusGateway } from './doctor-status.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('DoctorStatusService', () => {
  let service: DoctorStatusService;
  let repo: any;
  let prisma: any;
  let travelService: any;
  let gateway: any;

  beforeEach(async () => {
    const mockRepo = {
      findByDoctorId: jest.fn(),
      findById: jest.fn(),
      upsert: jest.fn(),
      createHistory: jest.fn(),
      findHistoryByDoctorId: jest.fn(),
    };

    const mockPrisma = {
      doctor: {
        findUnique: jest.fn(),
      },
      doctorStatus: {
        findMany: jest.fn(),
      },
    };

    const mockTravelService = {
      getTravelTimeBetweenHospitals: jest.fn(),
    };

    const mockGateway = {
      broadcastStatusChange: jest.fn(),
      broadcastEtaUpdated: jest.fn(),
      broadcastDoctorArrived: jest.fn(),
      broadcastEmergencyAccepted: jest.fn(),
      broadcastEmergencyCompleted: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorStatusService,
        { provide: DoctorStatusRepository, useValue: mockRepo },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TravelService, useValue: mockTravelService },
        { provide: DoctorStatusGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<DoctorStatusService>(DoctorStatusService);
    repo = module.get<DoctorStatusRepository>(DoctorStatusRepository);
    prisma = module.get<PrismaService>(PrismaService);
    travelService = module.get<TravelService>(TravelService);
    gateway = module.get<DoctorStatusGateway>(DoctorStatusGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('State Machine & Transitions', () => {
    const doctorId = 'doc-1';
    const hospitalId = 'hosp-1';

    beforeEach(() => {
      prisma.doctor.findUnique.mockResolvedValue({ id: doctorId });
    });

    it('should transition to In Consultation from Available on appointment start', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'Available' });
      repo.upsert.mockResolvedValue({ doctorId, status: 'In Consultation', currentHospitalId: hospitalId });

      await service.transitionOnAppointmentStart(doctorId, hospitalId);

      expect(repo.upsert).toHaveBeenCalledWith(
        doctorId,
        {
          status: 'In Consultation',
          currentHospitalId: hospitalId,
          nextHospitalId: null,
          etaMinutes: null,
          progress: 0,
        },
        expect.any(Object),
      );
      expect(repo.createHistory).toHaveBeenCalledWith({
        doctorId,
        status: 'In Consultation',
        reason: 'Appointment started',
        actor: 'system',
      });
      expect(gateway.broadcastStatusChange).toHaveBeenCalled();
    });

    it('should reject transition to In Consultation if current status is Offline', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'Offline' });

      await expect(service.transitionOnAppointmentStart(doctorId, hospitalId)).rejects.toThrow(BadRequestException);
    });

    it('should transition on appointment end to Available if hospital is same', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'In Consultation' });
      repo.upsert.mockResolvedValue({ doctorId, status: 'Available', currentHospitalId: hospitalId });

      await service.transitionOnAppointmentEnd(doctorId, hospitalId, hospitalId);

      expect(repo.upsert).toHaveBeenCalledWith(
        doctorId,
        {
          status: 'Available',
          currentHospitalId: hospitalId,
          nextHospitalId: null,
          etaMinutes: null,
          progress: 0,
        },
        expect.any(Object),
      );
    });

    it('should transition on appointment end to In Transit if hospital is different', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'In Consultation' });
      travelService.getTravelTimeBetweenHospitals.mockResolvedValue(10);
      repo.upsert.mockResolvedValue({ doctorId, status: 'In Transit', nextHospitalId: 'hosp-2', etaMinutes: 10 });

      await service.transitionOnAppointmentEnd(doctorId, hospitalId, 'hosp-2');

      expect(repo.upsert).toHaveBeenCalledWith(
        doctorId,
        {
          status: 'In Transit',
          currentHospitalId: null,
          nextHospitalId: 'hosp-2',
          etaMinutes: 10,
          progress: 0,
        },
        expect.any(Object),
      );
    });

    it('should transition to Emergency Active from any status and save previousStatus', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'On Break' });
      repo.upsert.mockResolvedValue({ doctorId, status: 'Emergency Active', previousStatus: 'On Break' });

      await service.transitionOnEmergencyAccept(doctorId);

      expect(repo.upsert).toHaveBeenCalledWith(
        doctorId,
        {
          status: 'Emergency Active',
          previousStatus: 'On Break',
        },
        expect.any(Object),
      );
      expect(gateway.broadcastEmergencyAccepted).toHaveBeenCalledWith(doctorId);
    });

    it('should restore previous status when emergency is completed', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'Emergency Active', previousStatus: 'On Break' });
      repo.upsert.mockResolvedValue({ doctorId, status: 'On Break', previousStatus: null });

      await service.transitionOnEmergencyComplete(doctorId);

      expect(repo.upsert).toHaveBeenCalledWith(
        doctorId,
        {
          status: 'On Break',
          previousStatus: null,
        },
        expect.any(Object),
      );
      expect(gateway.broadcastEmergencyCompleted).toHaveBeenCalledWith(doctorId, 'On Break');
    });

    it('should reject manual transitions to Consultation, Transit, or Emergency Active', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'Available' });

      await expect(service.updateStatusManual(doctorId, 'In Consultation')).rejects.toThrow(BadRequestException);
      await expect(service.updateStatusManual(doctorId, 'In Transit')).rejects.toThrow(BadRequestException);
      await expect(service.updateStatusManual(doctorId, 'Emergency Active')).rejects.toThrow(BadRequestException);
    });

    it('should allow valid manual transitions', async () => {
      repo.findByDoctorId.mockResolvedValue({ doctorId, status: 'Available' });
      repo.upsert.mockResolvedValue({ doctorId, status: 'On Break' });

      await service.updateStatusManual(doctorId, 'On Break', 'Resting');

      expect(repo.upsert).toHaveBeenCalledWith(
        doctorId,
        {
          status: 'On Break',
          nextHospitalId: null,
          etaMinutes: null,
          progress: 0,
          previousStatus: null,
        },
        expect.any(Object),
      );
    });
  });

  describe('ETA decrement and Loop', () => {
    it('should decrement ETA and broadcast eta_updated if ETA > 0', async () => {
      prisma.doctorStatus.findMany.mockResolvedValue([
        { doctorId: 'doc-1', status: 'In Transit', etaMinutes: 5, nextHospitalId: 'hosp-2' },
      ]);

      await service.decrementETAs();

      expect(repo.upsert).toHaveBeenCalledWith(
        'doc-1',
        { etaMinutes: 4 },
        expect.any(Object),
      );
      expect(gateway.broadcastEtaUpdated).toHaveBeenCalledWith('doc-1', 'hosp-2', 4);
    });

    it('should transition to Available and broadcast doctor_arrived if ETA reaches 0', async () => {
      prisma.doctorStatus.findMany.mockResolvedValue([
        { doctorId: 'doc-1', status: 'In Transit', etaMinutes: 1, nextHospitalId: 'hosp-2' },
      ]);
      repo.upsert.mockResolvedValue({ doctorId: 'doc-1', status: 'Available', currentHospitalId: 'hosp-2' });

      await service.decrementETAs();

      expect(repo.upsert).toHaveBeenCalledWith(
        'doc-1',
        {
          status: 'Available',
          currentHospitalId: 'hosp-2',
          nextHospitalId: null,
          etaMinutes: null,
          progress: 100,
        },
        expect.any(Object),
      );
      expect(gateway.broadcastDoctorArrived).toHaveBeenCalledWith('doc-1', 'hosp-2');
    });
  });

  describe('Hospital Visibility Masking', () => {
    const statusRow = {
      doctorId: 'doc-1',
      status: 'In Transit',
      nextHospitalId: 'hosp-2',
      etaMinutes: 15,
      progress: 20,
    };

    it('should mask status as Unavailable if hospital ID context does not match nextHospitalId', () => {
      const result = service.applyMasking(statusRow, 'hosp-3');

      expect(result.status).toBe('Unavailable');
      expect(result.displayMessage).toContain('Unavailable until');
      expect(result.etaMinutes).toBeNull();
    });

    it('should return actual status and ETA if hospital ID context matches nextHospitalId', () => {
      const result = service.applyMasking(statusRow, 'hosp-2');

      expect(result.status).toBe('In Transit');
      expect(result.etaMinutes).toBe(15);
    });

    it('should return actual status if no hospital ID context is provided', () => {
      const result = service.applyMasking(statusRow);

      expect(result.status).toBe('In Transit');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { EmergenciesRepository } from './emergencies.repository';
import { NotFoundException } from '@nestjs/common';

describe('RankingService', () => {
  let service: RankingService;
  let repository: jest.Mocked<EmergenciesRepository>;

  const mockHospital = {
    id: 'hosp-1',
    name: 'Hospital One',
    x: 0,
    y: 0,
    subscriptionStatus: 'active',
    shortName: 'H1',
    address: 'Addr',
    settings: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockDoctor = {
    id: 'doc-1',
    userId: 'user-1',
    specialty: 'Cardiology',
    subspecialty: null,
    avatar: null,
    experience: 5,
    emergencyOptIn: true,
    travelRadius: 15,
    defaultConsultationDuration: 30,
    defaultBuffer: 5,
    notificationPreferences: null,
    skills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: {
      id: 'user-1',
      email: 'doc1@test.com',
      passwordHash: 'hash',
      name: 'Dr. John',
      roleId: 'role-1',
      isActive: true,
      mfaEnabled: false,
      mfaSecret: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    status: {
      id: 'status-1',
      doctorId: 'doc-1',
      status: 'Available',
      currentHospitalId: 'hosp-1',
      nextHospitalId: null,
      x: 0,
      y: 0,
      progress: 0,
      updatedAt: new Date(),
    },
    hospitals: [
      {
        id: 'aff-1',
        doctorId: 'doc-1',
        hospitalId: 'hosp-1',
        isPrimary: true,
        isActive: true,
        empanelmentDate: new Date(),
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        hospital: {
          id: 'hosp-1',
          name: 'Hospital One',
          x: 0,
          y: 0,
        },
      },
    ],
    appointments: [],
    emergencyAssignments: [],
  };

  beforeEach(async () => {
    const mockRepo = {
      findHospitalById: jest.fn(),
      findDoctorsForRanking: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        { provide: EmergenciesRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    repository = module.get(EmergenciesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if requesting hospital is not found', async () => {
    repository.findHospitalById.mockResolvedValue(null);
    await expect(service.rankDoctors('invalid-id', 'Cardiology')).rejects.toThrow(
      NotFoundException,
    );
  });

  describe('Eligibility Checks', () => {
    it('should filter out doctor if user profile is inactive or deleted', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);
      const inactiveDoc = {
        ...mockDoctor,
        user: { ...mockDoctor.user, isActive: false },
      };
      repository.findDoctorsForRanking.mockResolvedValue([inactiveDoc]);

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(0);
    });

    it('should filter out doctor if emergencyOptIn is false', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);
      const optOutDoc = { ...mockDoctor, emergencyOptIn: false };
      repository.findDoctorsForRanking.mockResolvedValue([optOutDoc]);

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(0);
    });

    it('should filter out doctor if doctor has an In Progress appointment', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);
      const busyDoc = {
        ...mockDoctor,
        appointments: [{ id: 'app-1', status: 'In Progress' } as any],
      };
      repository.findDoctorsForRanking.mockResolvedValue([busyDoc]);

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(0);
    });

    it('should filter out doctor if doctor is currently alerted or accepted on an active emergency', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);
      const busyDoc = {
        ...mockDoctor,
        emergencyAssignments: [
          {
            id: 'assign-1',
            status: 'Alerted',
            emergencyRequest: { id: 'req-2', status: 'Alerting' },
          } as any,
        ],
      };
      repository.findDoctorsForRanking.mockResolvedValue([busyDoc]);

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(0);
    });

    it('should filter out doctor if travel time exceeds travel radius', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);
      // Hospital One is at (0, 0)
      // Doctor is at (10, 10). distance = sqrt(200) = 14.14. travelTime = 28.28.
      // Travel radius is 15. So travelTime (28.28) > travelRadius (15) => Ineligible.
      const distantDoc = {
        ...mockDoctor,
        travelRadius: 15,
        hospitals: [
          {
            ...mockDoctor.hospitals[0],
            hospital: { id: 'hosp-2', name: 'Hospital Two', x: 10, y: 10 },
          },
        ],
        status: {
          ...mockDoctor.status,
          currentHospitalId: 'hosp-2',
        },
      };
      repository.findDoctorsForRanking.mockResolvedValue([distantDoc]);
      repository.findHospitalById.mockImplementation(async (id) => {
        if (id === 'hosp-1') return mockHospital;
        if (id === 'hosp-2') return { ...mockHospital, id: 'hosp-2', x: 10, y: 10 };
        return null;
      });

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(0);
    });
  });

  describe('Scoring Logic', () => {
    it('should correctly score a doctor with perfect attributes', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);
      repository.findDoctorsForRanking.mockResolvedValue([mockDoctor]);

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(1);
      const ranked = result[0];

      // Distance score: travelTime = 0 (<= 5 mins) -> 100 points (weight 40%)
      // Availability: Available -> 100 points (weight 35%)
      // Specialty Match: Cardiology matches Cardiology -> 100 points (weight 15%)
      // Response History: No history -> default 80 points (weight 10%)
      // Total: (100 * 0.40) + (100 * 0.35) + (100 * 0.15) + (80 * 0.10) = 40 + 35 + 15 + 8 = 98 points.
      expect(ranked.score).toBe(98);
      expect(ranked.rank).toBe(1);
      expect(ranked.scoreComponents.distanceScore).toBe(100);
      expect(ranked.scoreComponents.availabilityScore).toBe(100);
      expect(ranked.scoreComponents.specialtyScore).toBe(100);
      expect(ranked.scoreComponents.historyScore).toBe(80);
      expect(ranked.explanation).toContain('Distance Score: 100');
    });

    it('should scale distance score linearly and use response history rate', async () => {
      repository.findHospitalById.mockResolvedValue(mockHospital);

      // TravelTime = Euclidean distance * 2.
      // Distant hospital coordinates: (0, 4) => distance = 4. travelTime = 8 mins.
      // travelRadius = 15 mins.
      // Since travelTime (8) is between 5 and 15:
      // Score = 100 * (15 - 8) / (15 - 5) = 100 * 7 / 10 = 70 points.
      const partiallyDistantDoc = {
        ...mockDoctor,
        travelRadius: 15,
        hospitals: [
          {
            ...mockDoctor.hospitals[0],
            hospital: { id: 'hosp-3', name: 'Hospital Three', x: 0, y: 4 },
          },
        ],
        status: {
          ...mockDoctor.status,
          currentHospitalId: 'hosp-3',
          status: 'Consulting', // Availability score 50 (weight 35%)
        },
        emergencyAssignments: [
          { id: 'a1', status: 'Accepted' },
          { id: 'a2', status: 'Declined' },
          { id: 'a3', status: 'Timeout' },
          { id: 'a4', status: 'Accepted' },
        ] as any, // history: 2 Accepted, 1 Declined, 1 Timeout -> 2/4 = 50% acceptance rate => 50 history points.
      };

      repository.findDoctorsForRanking.mockResolvedValue([partiallyDistantDoc]);
      repository.findHospitalById.mockImplementation(async (id) => {
        if (id === 'hosp-1') return mockHospital;
        if (id === 'hosp-3') return { ...mockHospital, id: 'hosp-3', x: 0, y: 4 };
        return null;
      });

      const result = await service.rankDoctors('hosp-1', 'Cardiology');
      expect(result).toHaveLength(1);
      const ranked = result[0];

      // Distance score = 70 (weight 40%) -> 28
      // Availability score = 50 (weight 35%) -> 17.5
      // Specialty score = 100 (weight 15%) -> 15
      // History score = 50 (weight 10%) -> 5
      // Total = 28 + 17.5 + 15 + 5 = 65.5
      expect(ranked.score).toBe(65.5);
      expect(ranked.scoreComponents.distanceScore).toBe(70);
      expect(ranked.scoreComponents.availabilityScore).toBe(50);
      expect(ranked.scoreComponents.historyScore).toBe(50);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EmergenciesController } from './emergencies.controller';
import { EmergenciesService } from './emergencies.service';
import { EscalationService } from './escalation.service';

describe('EmergenciesController', () => {
  let controller: EmergenciesController;
  let service: jest.Mocked<EmergenciesService>;
  let escalationService: jest.Mocked<EscalationService>;

  const mockActor = {
    name: 'Hospital Coordinator',
    role: 'Staff',
    ip: '127.0.0.1',
    device: 'Web App',
  };

  const mockUser = {
    id: 'user-1',
    name: 'Hospital Coordinator',
    role: { name: 'Staff' },
  };

  const mockReq = {
    ip: '127.0.0.1',
    headers: {
      'user-agent': 'Web App',
    },
  };

  const mockEmergency = {
    id: 'req-1',
    hospitalId: 'hosp-1',
    specialty: 'Cardiology',
    urgency: 'Critical',
    status: 'Searching',
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      accept: jest.fn(),
      decline: jest.fn(),
      cancel: jest.fn(),
      complete: jest.fn(),
      getEscalationLogs: jest.fn(),
    };

    const mockEscalationService = {
      checkEscalations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergenciesController],
      providers: [
        { provide: EmergenciesService, useValue: mockService },
        { provide: EscalationService, useValue: mockEscalationService },
      ],
    }).compile();

    controller = module.get<EmergenciesController>(EmergenciesController);
    service = module.get(EmergenciesService);
    escalationService = module.get(EscalationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = { hospitalId: 'hosp-1', specialty: 'Cardiology', urgency: 'Critical' };
      service.create.mockResolvedValue(mockEmergency as any);

      const result = await controller.create(dto, mockUser, mockReq);

      expect(service.create).toHaveBeenCalledWith(dto, expect.objectContaining({
        name: 'Hospital Coordinator',
        role: 'Staff',
        ip: '127.0.0.1',
        device: 'Web App',
      }));
      expect(result).toEqual(mockEmergency);
    });
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const query = { page: 1, limit: 10 };
      const serviceResult = { items: [mockEmergency], total: 1 };
      service.findAll.mockResolvedValue(serviceResult as any);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(serviceResult);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      service.findOne.mockResolvedValue(mockEmergency as any);

      const result = await controller.findOne('req-1');

      expect(service.findOne).toHaveBeenCalledWith('req-1');
      expect(result).toEqual(mockEmergency);
    });
  });

  describe('accept', () => {
    it('should delegate to service.accept', async () => {
      const acceptDto = { responseMode: 'Physical Visit' as const, eta: 10 };
      service.accept.mockResolvedValue({ ...mockEmergency, status: 'Travelling' } as any);

      const result = await controller.accept('req-1', acceptDto, mockUser, mockReq);

      expect(service.accept).toHaveBeenCalledWith('req-1', acceptDto, mockUser, expect.any(Object));
      expect(result.status).toBe('Travelling');
    });
  });

  describe('decline', () => {
    it('should delegate to service.decline', async () => {
      service.decline.mockResolvedValue({ ...mockEmergency, status: 'Alerting' } as any);

      const result = await controller.decline('req-1', mockUser, mockReq);

      expect(service.decline).toHaveBeenCalledWith('req-1', mockUser, expect.any(Object));
      expect(result.status).toBe('Alerting');
    });
  });

  describe('cancel', () => {
    it('should delegate to service.cancel', async () => {
      service.cancel.mockResolvedValue({ ...mockEmergency, status: 'Cancelled' } as any);

      const result = await controller.cancel('req-1', mockUser, mockReq);

      expect(service.cancel).toHaveBeenCalledWith('req-1', expect.any(Object));
      expect(result.status).toBe('Cancelled');
    });
  });

  describe('complete', () => {
    it('should delegate to service.complete', async () => {
      service.complete.mockResolvedValue({ ...mockEmergency, status: 'Completed' } as any);

      const result = await controller.complete('req-1', mockUser, mockReq);

      expect(service.complete).toHaveBeenCalledWith('req-1', expect.any(Object));
      expect(result.status).toBe('Completed');
    });
  });

  describe('getEscalations', () => {
    it('should delegate to service.getEscalationLogs', async () => {
      const logs = [{ id: '1', action: 'Push', details: 'Sent' } as any];
      service.getEscalationLogs.mockResolvedValue(logs);

      const result = await controller.getEscalations('req-1');

      expect(service.getEscalationLogs).toHaveBeenCalledWith('req-1');
      expect(result).toEqual(logs);
    });
  });

  describe('triggerEscalations', () => {
    it('should delegate to escalationService.checkEscalations', async () => {
      const result = await controller.triggerEscalations();

      expect(escalationService.checkEscalations).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Escalation check triggered successfully' });
    });
  });
});

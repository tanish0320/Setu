import { Test, TestingModule } from '@nestjs/testing';
import { DoctorStatusController } from './doctor-status.controller';
import { DoctorStatusService } from './doctor-status.service';
import { AuditLogService } from '../audit-log/audit-log.service';

describe('DoctorStatusController', () => {
  let controller: DoctorStatusController;
  let service: any;
  let auditLogService: any;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatusManual: jest.fn(),
      getOrCreateStatus: jest.fn(),
      findHistory: jest.fn(),
      applyMasking: jest.fn(),
    };

    const mockAuditLog = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorStatusController],
      providers: [
        { provide: DoctorStatusService, useValue: mockService },
        { provide: AuditLogService, useValue: mockAuditLog },
      ],
    }).compile();

    controller = module.get<DoctorStatusController>(DoctorStatusController);
    service = module.get<DoctorStatusService>(DoctorStatusService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with correct params', async () => {
      const query = { page: 1, limit: 10 };
      const req = { headers: { 'x-hospital-id': 'hosp-1' } };
      service.findAll.mockResolvedValue({ items: [], total: 0 });

      const result = await controller.findAll(query, req);

      expect(service.findAll).toHaveBeenCalledWith(query, 'hosp-1');
      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct params', async () => {
      const req = { headers: {} };
      service.findOne.mockResolvedValue({ doctorId: 'doc-1', status: 'Available' });

      const result = await controller.findOne('doc-1', 'hosp-1', req);

      expect(service.findOne).toHaveBeenCalledWith('doc-1', 'hosp-1');
      expect(result).toEqual({ doctorId: 'doc-1', status: 'Available' });
    });
  });

  describe('update', () => {
    it('should manually update doctor status and write audit log', async () => {
      const updateDto = { status: 'On Break', reason: 'Lunch' };
      const user = { name: 'Dr. Jones', role: { name: 'Doctor' } };
      const req = { ip: '127.0.0.1', headers: { 'user-agent': 'Jest' } };

      service.findOne.mockResolvedValue({ doctorId: 'doc-1', status: 'Available' });
      service.updateStatusManual.mockResolvedValue({ doctorId: 'doc-1', status: 'On Break' });

      const result = await controller.update('doc-1', updateDto, user, req);

      expect(service.updateStatusManual).toHaveBeenCalledWith('doc-1', 'On Break', 'Lunch', 'Dr. Jones');
      expect(auditLogService.log).toHaveBeenCalledWith(
        'doctor_status:manual_update',
        { name: 'Dr. Jones', role: 'Doctor', ip: '127.0.0.1', device: 'Jest' },
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({ doctorId: 'doc-1', status: 'On Break' });
    });
  });

  describe('findHistory', () => {
    it('should return doctor status history', async () => {
      service.findOne.mockResolvedValue({ doctorId: 'doc-1' });
      service.findHistory.mockResolvedValue([{ id: 'h-1', status: 'Available' }]);

      const result = await controller.findHistory('doc-1');

      expect(service.findHistory).toHaveBeenCalledWith('doc-1');
      expect(result).toEqual([{ id: 'h-1', status: 'Available' }]);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AffiliationsController } from './affiliations.controller';
import { AffiliationsService } from './affiliations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('AffiliationsController', () => {
  let controller: AffiliationsController;
  let service: jest.Mocked<AffiliationsService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliationsController],
      providers: [{ provide: AffiliationsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AffiliationsController>(AffiliationsController);
    service = module.get(AffiliationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const query = { page: 1, limit: 10 };
      await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});

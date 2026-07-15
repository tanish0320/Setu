import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { NotFoundException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repository: PermissionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsService, PermissionsRepository],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    repository = module.get<PermissionsRepository>(PermissionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of permissions', async () => {
      const result = await service.findAll({});
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result.items.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return permission details when ID exists', async () => {
      const all = await repository.findAll({});
      const target = all.items[0];
      const result = await service.findOne(target.id);
      expect(result).toEqual(target);
    });

    it('should throw NotFoundException when permission ID does not exist', async () => {
      await expect(service.findOne('invalid-permission-id')).rejects.toThrow(NotFoundException);
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionsRepository } from './permissions.repository';
import { QueryPermissionsDto } from './dto/query-permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findAll(query: QueryPermissionsDto) {
    return this.permissionsRepository.findAll(query);
  }

  async findOne(id: string) {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
    return permission;
  }
}

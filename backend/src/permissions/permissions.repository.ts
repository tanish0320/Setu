import { Injectable } from '@nestjs/common';
import { ALL_PERMISSIONS } from './permissions.constants';

export interface PermissionEntity {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class PermissionsRepository {
  private readonly permissions: PermissionEntity[] = ALL_PERMISSIONS.map((perm) => ({
    id: perm,
    name: perm,
    description: `Grants permission to perform ${perm.replace(':', ' ')} operations`,
  }));

  async findAll(query: { search?: string; page?: number; limit?: number }) {
    let result = [...this.permissions];

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    const total = result.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const items = result.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<PermissionEntity | null> {
    return this.permissions.find((p) => p.id === id) || null;
  }
}

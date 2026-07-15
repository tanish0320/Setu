export const SystemPermissions = {
  // Roles
  CREATE_ROLE: 'roles:create',
  READ_ROLE: 'roles:read',
  UPDATE_ROLE: 'roles:update',
  DELETE_ROLE: 'roles:delete',

  // Permissions
  READ_PERMISSION: 'permissions:read',

  // Users
  CREATE_USER: 'users:create',
  READ_USER: 'users:read',
  UPDATE_USER: 'users:update',
  DELETE_USER: 'users:delete',
  DEACTIVATE_USER: 'users:deactivate',
  ASSIGN_ROLE: 'users:assign-role',
  CHANGE_PASSWORD: 'users:change-password',
};

export const ALL_PERMISSIONS = Object.values(SystemPermissions);

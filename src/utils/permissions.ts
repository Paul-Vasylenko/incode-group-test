import ApiError from './errors';

interface IPermissions {
  permissions: string[];
}
export const checkPermissions = (user: IPermissions, required: string[]) => {
  const allowed = required.some((permission) =>
    user.permissions.includes(permission),
  );

  if (!allowed)
    throw new ApiError({
      message: 'Permission denied',
      type: 'PERMISSION_DENIED',
      status: 403,
    });
};

export const isAllowedAll = (user: IPermissions, required: string[]) => {
  const allowed = required.every((permission) =>
    user.permissions.includes(permission),
  );

  return allowed;
};
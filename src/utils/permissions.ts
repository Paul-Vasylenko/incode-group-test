import ApiError from './errors';

interface IPermissions {
  permissions: string[];
}
export const isAllowed = (user: IPermissions, required: string[]) => {
  const allowed = required.some((permission) =>
    user.permissions.includes(permission),
  );

  if (!allowed)
    throw new ApiError({
      message: 'Permission denied',
      type: 'PERMISSION_DENIED',
      status: 403,
    });

  return allowed;
};

interface IPermissions {
    permissions: string[];
}
export const isAllowed = (user: IPermissions, required: string[]) => {
    const allowed = required.some(permission => user.permissions.includes(permission));

    if (!allowed) throw new Error('Permission denied')

    return allowed;
}
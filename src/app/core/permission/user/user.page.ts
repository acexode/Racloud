import { UserPagePermissionsData, UserRolePermissions } from './user.permission.interface';

const admin: UserPagePermissionsData = {
    screen: 'full',
    columns: {
        firstName: 'full',
        lastName: 'full',
        email: 'full',
        role: 'full'
    },
    actions: {
        add: 'full',
        manageUpdate: 'full',
        delete: 'full'
    }
};
const licenseManager: UserPagePermissionsData = {
    screen: 'hidden',
};
const user: UserPagePermissionsData = {
    screen: 'hidden',
};
export const userPagePermission: UserRolePermissions = {
    main: {
        admin,
        licenseManager,
        user,
    },
    partner: {
        admin,
        licenseManager,
        user,
    },
    reseller: {
        admin,
        licenseManager,
        user,
    },
    fabricator: {
        admin,
        user,
    }
};
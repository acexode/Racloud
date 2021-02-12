import { UserDetailsPagePermissionsData, UserRolePermissions } from "./user.permission.interface";

export const admin: UserDetailsPagePermissionsData = {
    screen: 'full',
    fields: {
        firstName: 'full',
        lastName: 'full',
        email: 'full',
        role: 'full'
    },
    actions: {
        update: 'full',
        changePassword: 'full',
    }
};

const licenseManager: UserDetailsPagePermissionsData = admin;
const user: UserDetailsPagePermissionsData = {
    screen: 'hidden',
}

export const userDetailsPermission: UserRolePermissions = {
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
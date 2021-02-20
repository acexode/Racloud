export interface UserPagePermissionsData {
    screen: 'full' | 'hidden' | 'readonly';
    columns?: UserPermissionsFields;
    actions?: UserPermissionsPageAction;
}
export interface UserDetailsPagePermissionsData {
    screen: 'full' | 'hidden' | 'readonly';
    fields?: UserPermissionsFields;
    actions?: UserDetailsPermissionsAction;
}
export interface UserPermissionsFields {
    firstName: 'full' | 'hidden' | 'readonly';
    lastName: 'full' | 'hidden' | 'readonly';
    email: 'full' | 'hidden' | 'readonly';
    role: 'full' | 'hidden' | 'readonly';
}

export interface UserPermissionsPageAction {
    add: 'full' | 'hidden' | 'readonly';
    manageUpdate: 'full' | 'hidden' | 'readonly';
    delete: 'full' | 'hidden' | 'readonly';
}
export interface UserDetailsPermissionsAction {
    update: 'full' | 'hidden' | 'readonly';
    changePassword: 'full' | 'hidden' | 'readonly';
}
export interface UserRoles {
    admin: UserPagePermissionsData | UserDetailsPagePermissionsData;
    licenseManager: UserPagePermissionsData | UserDetailsPagePermissionsData;
    user: UserPagePermissionsData | UserDetailsPagePermissionsData;
}
export interface UserRoleFabricator {
    admin: UserPagePermissionsData | UserDetailsPagePermissionsData;
    user: UserPagePermissionsData | UserDetailsPagePermissionsData;
}
export interface UserRolePermissions {
    main: UserRoles;
    partner: UserRoles;
    reseller: UserRoles;
    fabricator: UserRoleFabricator;
}

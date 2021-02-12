export interface UserPagePermissionsData {
    screen: 'full' | 'hidden';
    columns?: UserPermissionsFields;
    actions?: UserPermissionsPageAction;
}
export interface UserDetailsPagePermissionsData {
    screen: 'full' | 'hidden';
    fields?: UserPermissionsFields;
    actions?: UserDetailsPermissionsAction;
}
export interface UserPermissionsFields {
    firstName: 'full' | 'hidden';
    lastName: 'full' | 'hidden';
    email: 'full' | 'hidden';
    role: 'full' | 'hidden';
}

export interface UserPermissionsPageAction {
    add: 'full' | 'hidden';
    manageUpdate: 'full' | 'hidden';
    delete: 'full' | 'hidden';
}
export interface UserDetailsPermissionsAction {
    update: 'full' | 'hidden';
    changePassword: 'full' | 'hidden';
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

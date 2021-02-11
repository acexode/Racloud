export interface UserPagePermissions {
    customers: boolean;
    licenses: boolean;
    options: boolean;
    orders: boolean;
    pricelists: boolean;
    products: boolean;
    users: boolean;
}
export interface UserPagePermissionsModel {
    init?: boolean;
    data: UserPagePermissions;
}
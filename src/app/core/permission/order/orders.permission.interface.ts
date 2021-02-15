export interface OrderPagePermissionsData {
    screen: 'full' | 'hidden' | 'readonly';
    columns: OrderPageGridColumnsPermissionsData;
    actions: OrderPermissionsPageAction;
}
export interface OrderDetailsPagePermissionsData {
    screen: 'full' | 'hidden' | 'readonly';
    fields: OrderPermissionsFields;
    gridColumns: OrderDetailsGridColumnsPermissionsData;
    actions: OrderDetailsPermissionsAction;
}
export interface OrderPageGridColumnsPermissionsData {
    id: 'full' | 'hidden' | 'readonly';
    companyName: 'full' | 'hidden' | 'readonly';
    orderStatus: 'full' | 'hidden' | 'readonly';
    createDate: 'full' | 'hidden' | 'readonly';
    value: 'full' | 'hidden' | 'readonly';
    discount: 'full' | 'hidden' | 'readonly';
    totalValue: 'full' | 'hidden' | 'readonly';
}
export interface OrderDetailsGridColumnsPermissionsData {
    productType: 'full' | 'hidden' | 'readonly';
    quantity: 'full' | 'hidden' | 'readonly';
    value: 'full' | 'hidden' | 'readonly';
    discount: 'full' | 'hidden' | 'readonly';
    totalValue: 'full' | 'hidden' | 'readonly';

}
export interface OrderPermissionsFields {
    orderNumber: 'full' | 'hidden' | 'readonly';
    orderDate: 'full' | 'hidden' | 'readonly';
    companyId: 'full' | 'hidden' | 'readonly';
    status: 'full' | 'hidden' | 'readonly';
    value: 'full' | 'hidden' | 'readonly';
    discount: 'full' | 'hidden' | 'readonly';
    totalValue: 'full' | 'hidden' | 'readonly';

}

export interface OrderPermissionsPageAction {
    add: 'full' | 'hidden' | 'readonly';
    view: 'full' | 'hidden' | 'readonly';
    manageUpdate: 'full' | 'hidden' | 'readonly';
    delete: 'full' | 'hidden' | 'readonly';

}
export interface OrderDetailsPermissionsAction {
    add: 'full' | 'hidden' | 'readonly';
    update: 'full' | 'hidden' | 'readonly';
    delete: 'full' | 'hidden' | 'readonly';

}
export interface OrderRoles {
    admin: OrderPagePermissionsData | OrderDetailsPagePermissionsData;
    licenseManager: OrderPagePermissionsData | OrderDetailsPagePermissionsData;
    user: OrderPagePermissionsData | OrderDetailsPagePermissionsData;
}
export interface OrderRoleFabricator {
    admin: OrderPagePermissionsData | OrderDetailsPagePermissionsData;
    user: OrderPagePermissionsData | OrderDetailsPagePermissionsData;
}
export interface OrderRolePermissions {
    main: OrderRoles;
    partner: OrderRoles;
    reseller: OrderRoles;
    fabricator: OrderRoleFabricator;
}

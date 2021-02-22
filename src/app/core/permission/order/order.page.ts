import { get } from 'lodash';
import { AuthState } from '../../models/auth-state.interface';
import { OrderPagePermissionsData, OrderRolePermissions } from './orders.permission.interface';

const adminFull: OrderPagePermissionsData = {
    screen: 'full',
    columns: {
        id: 'full',
        companyName: 'full',
        orderStatus: 'full',
        createDate: 'full',
        value: 'full',
        discount: 'full',
        totalValue: 'full'
    },
    actions: {
        add: 'full',
        manageUpdate: 'full',
        view: 'full',
        delete: 'full'
    }

};
const adminCustomerReadonly: OrderPagePermissionsData = {
    screen: 'full',
    columns: {
        id: 'full',
        companyName: 'hidden',
        orderStatus: 'full',
        createDate: 'full',
        value: 'full',
        discount: 'full',
        totalValue: 'full'
    },
    actions: {
        add: 'hidden',
        manageUpdate: 'hidden',
        view: 'full',
        delete: 'hidden'
    }

};
const allHidden: OrderPagePermissionsData = {
    screen: 'hidden',
    columns: {
        id: 'hidden',
        companyName: 'hidden',
        orderStatus: 'hidden',
        createDate: 'hidden',
        value: 'hidden',
        discount: 'hidden',
        totalValue: 'hidden'
    },
    actions: {
        add: 'hidden',
        manageUpdate: 'hidden',
        view: 'hidden',
        delete: 'hidden'
    }

};
const licenseManager = allHidden;
const user = allHidden;
export const orderPagePermission: OrderRolePermissions = {
    main: {
        systemadmin: adminFull,
        admin: adminFull,
        licenseManager,
        user,
    },
    partner: {
        systemadmin: adminCustomerReadonly,
        admin: adminCustomerReadonly,
        licenseManager,
        user,
    },
    reseller: {
        systemadmin: adminFull,
        admin: adminFull,
        licenseManager,
        user,
    },
    fabricator: {
        systemadmin: adminCustomerReadonly,
        admin: adminCustomerReadonly,
        user,
    }
};
export const getOrderPagePermissions = (userAuth: AuthState): OrderPagePermissionsData => {
    const account = get(userAuth, 'account', null);
    const role = get(account, 'roles', null);
    const companyType = get(get(account, 'company', null), 'companyType', null);
    if (role && companyType) {
        if (role.toLowerCase() === 'systemadmin') {
            return adminFull;
        } else {
            return orderPagePermission[companyType.toLowerCase()][role.toLowerCase()];
        }
    } else {
        return null;
    }
};
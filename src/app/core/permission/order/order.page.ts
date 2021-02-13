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
        add: 'full',
        manageUpdate: 'full',
        view: 'full',
        delete: 'full'
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
        admin: adminFull,
        licenseManager,
        user,
    },
    partner: {
        admin: adminCustomerReadonly,
        licenseManager,
        user,
    },
    reseller: {
        admin: adminFull,
        licenseManager,
        user,
    },
    fabricator: {
        admin: adminCustomerReadonly,
        user,
    }
};
export const getOrderPagePermissions = (userAuth: AuthState): OrderPagePermissionsData => {
    const account = get(userAuth, 'account', null);
    const role = get(account, 'roles', null);
    const companyType = get(get(account, 'company', null), 'companyType', null);
    if (role && companyType) {
        return orderPagePermission[companyType.toLowerCase()][role.toLowerCase()];
    } else {
        return null;
    }
};
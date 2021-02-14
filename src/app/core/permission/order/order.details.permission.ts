import { get } from 'lodash';
import { AuthState } from '../../models/auth-state.interface';
import { OrderDetailsPagePermissionsData, OrderPagePermissionsData, OrderRolePermissions } from './orders.permission.interface';

const adminFull: OrderDetailsPagePermissionsData = {
    screen: 'full',
    fields: {
        orderNumber: 'full',
        companyId: 'full',
        status: 'full',
        orderDate: 'full',
        value: 'full',
        discount: 'full',
        totalValue: 'full'
    },
    actions: {
        add: 'full',
        update: 'full',
        delete: 'full'
    }
};
const adminReadonly: OrderDetailsPagePermissionsData = {
    screen: 'full',
    fields: {
        orderNumber: 'readonly',
        companyId: 'hidden',
        status: 'readonly',
        orderDate: 'readonly',
        value: 'readonly',
        discount: 'readonly',
        totalValue: 'readonly'
    },
    actions: {
        add: 'hidden',
        update: 'hidden',
        delete: 'hidden'
    }
};
const allHidden: OrderDetailsPagePermissionsData = {
    screen: 'hidden',
    fields: {
        orderNumber: 'hidden',
        companyId: 'hidden',
        status: 'hidden',
        orderDate: 'hidden',
        value: 'hidden',
        discount: 'hidden',
        totalValue: 'hidden'
    },
    actions: {
        add: 'hidden',
        update: 'hidden',
        delete: 'hidden'
    }
};

const licenseManager = allHidden;
const user = allHidden;
export const orderDetailsPagePermission: OrderRolePermissions = {
    main: {
        admin: adminFull,
        licenseManager,
        user,
    },
    partner: {
        admin: adminReadonly,
        licenseManager,
        user,
    },
    reseller: {
        admin: adminFull,
        licenseManager,
        user,
    },
    fabricator: {
        admin: adminReadonly,
        user,
    }
};
export const getOrderDetailsPagePermissions = (userAuth: AuthState): OrderDetailsPagePermissionsData => {
    const account = get(userAuth, 'account', null);
    const role = get(account, 'roles', null);
    const companyType = get(get(account, 'company', null), 'companyType', null);
    if (role && companyType) {
        return orderDetailsPagePermission[companyType.toLowerCase()][role.toLowerCase()];
    } else {
        return null;
    }
};
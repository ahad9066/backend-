const ROLES = require('../constants/roles.constants')
module.exports = {
    'auth:health': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
        ]
    },
    'auth:signup': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
    'auth:changePassword': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
    'auth:resetPassword': {
        only: [
            ROLES.ADMIN,
            ROLES.CUSTOMER
        ]
    },
    'auth:permission': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
};

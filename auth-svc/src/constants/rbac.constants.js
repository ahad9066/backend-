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
    'products:placeOrders': {
        only: [
            ROLES.CUSTOMER
        ]
    },
    'products:getAllOrders': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
        ]
    },
    'products:getOrdersByUserId': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
    'products:cancelOrder': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
    'products:products:updatePayemnt': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            // ROLES.SALES,
        ]
    },
    'products:addFeTiGrade': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
        ]
    },
    'products:getFeTiProducts': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
    'products:addToCart': {
        only: [
            ROLES.CUSTOMER
        ]
    },
    'products:getUserCartItems': {
        only: [
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.SALES,
            ROLES.CUSTOMER
        ]
    },
    'products:deleteUserCartItems': {
        only: [
            ROLES.CUSTOMER
        ]
    },
};

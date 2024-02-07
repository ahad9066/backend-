const ROLES = require('../constants/roles.constants')
module.exports = {
    'auth:health': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.LABTECH,
            ROLES.PARAMEDIC,
            ROLES.RECEPTIONIST,
            ROLES.STAFF
        ]
    },
    'auth:signup': {
        only: [
            ROLES.ADMIN
        ]
    },
    'auth:changePassword': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.LABTECH,
            ROLES.PARAMEDIC,
            ROLES.RECEPTIONIST,
            ROLES.STAFF
        ]
    },
    'auth:resetPassword': {
        only: [
            ROLES.ADMIN
        ]
    },
    'auth:permission': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.LABTECH,
            ROLES.PARAMEDIC,
            ROLES.RECEPTIONIST,
            ROLES.STAFF
        ]
    },
    // 'email:send': {
    //     only: [
    //        ROLES.ADMIN
    //     ]
    // },
    'auth:users-list': {
        only: [
            ROLES.ADMIN
        ]
    },
    'reg:initReg': {
        only: [
            ROLES.ADMIN,
            ROLES.RECEPTIONIST
        ]
    },
    'reg:getPatients': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.PARAMEDIC
        ]
    },
    'reg:getPatientById': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.PARAMEDIC
        ]
    },
    'reg:getPatientByVisit': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.PARAMEDIC
        ]
    },
    'reg:updatePatient': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR
        ]
    },
    'reg:addVisit': {
        only: [
            ROLES.ADMIN,
            ROLES.RECEPTIONIST
        ]
    },
    'reg:updateLabResult': {
        only: [
            ROLES.ADMIN,
            ROLES.LABTECH
        ]
    },
    'lab-results:health': {
        only: [
            ROLES.ADMIN,
            ROLES.LABTECH
        ]
    },
    'lab-results:upload': {
        only: [
            ROLES.ADMIN,
            ROLES.LABTECH
        ]
    },
    'lab-results:download': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.LABTECH
        ]
    },
    'lab-results:email': {
        only: [
            ROLES.ADMIN,
            ROLES.DOCTOR
        ]
    }
};

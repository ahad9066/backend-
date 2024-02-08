module.exports = {
    employeeDetails: (emp) => ({
        _id: emp._id,
        email: emp.email,
        countryCode: emp.countryCode,
        mobile: emp.mobile,
        firstName: emp.firstName,
        lastName: emp.lastName,
        isMobileVerified: emp.isMobileVerified,
        isEmailVerified: emp.isEmailVerified,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
    }),
};

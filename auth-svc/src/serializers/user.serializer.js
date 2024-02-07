module.exports = {
    signedUpUser: (user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        mobile: user.mobile,
        isMobileVerified: user.isMobileVerified,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }),
    userDetails: (user) => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        countryCode: user.countryCode,
        mobile: user.mobile,
        isMobileVerified: user.isMobileVerified,
        isEmailVerified: user.isEmailVerified,
        addresses: user.addresses.map((address) => ({
            _id: address._id,
            unitNumber: address.unitNumber,
            buildingNumber: address.buildingNumber,
            streetName: address.streetName,
            city: address.city,
            province: address.province,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
        })),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }),
};

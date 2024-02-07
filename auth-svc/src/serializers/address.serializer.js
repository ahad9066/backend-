module.exports = {
    addressDetails: (address) => ({
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
    }),
};

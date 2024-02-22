module.exports = {
    orderDetails: (order) => ({
        orderId: order.orderId,
        userId: order.userId,
        firstName: order.firstName,
        lastName: order.lastName,
        address: {
            _id: order.address._id,
            unitNumber: order.address.unitNumber,
            buildingNumber: order.address.buildingNumber,
            streetName: order.address.streetName,
            city: order.address.city,
            province: order.address.province,
            postalCode: order.address.postalCode,
            country: order.address.country,
            isDefault: order.address.isDefault,
            createdAt: order.address.createdAt,
            updatedAt: order.address.updatedAt,
        },
        orderItems: order.orderItems.map(item => ({
            product: {
                id: item.product.id,
                name: item.product.name
            },
            subGrade: {
                id: item.subGrade.id,
                name: item.subGrade.name,
            },
            size: {
                id: item.size.id,
                name: item.size.name,
            },
            price: item.price,
            quantity: item.quantity,
        })),
        totalAmount: order.totalAmount,
        status: order.status,
        invoiceFileKey: order.invoiceFileKey,
        isInvoiceGenerated: order.isInvoiceGenerated,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }),
};

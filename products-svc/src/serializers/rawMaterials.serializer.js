module.exports = {
    rawMaterialsDetails: (rawMaterial) => ({
        id: rawMaterial.id,
        name: rawMaterial.name,
        stockCount: rawMaterial.stockCount,
        holdCount: rawMaterial.holdCount,
        createdAt: rawMaterial.createdAt,
        updatedAt: rawMaterial.updatedAt,
    }),
};

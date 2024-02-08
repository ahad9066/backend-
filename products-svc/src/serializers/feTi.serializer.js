module.exports = {
    feTiProductDetails: (feTiProduct) => ({
        id: feTiProduct.id,
        name: feTiProduct.name,
        subGrades: feTiProduct.subGrades.map(subGrade => ({
            id: subGrade.id,
            name: subGrade.name,
            composition: subGrade.composition.map(composition => ({
                metalID: composition.metalID,
                metalName: composition.metalName,
                percentage: composition.percentage,
            })),
            sizes: subGrade.sizes.map(size => ({
                id: size.id,
                name: size.name,
                stockCount: size.stockCount
            })),
            price: subGrade.price
        })),
        createdAt: feTiProduct.createdAt,
        updatedAt: feTiProduct.updatedAt,
    }),
};

const RawMaterialModel = require('../models/rawMaterial.model')
const FeTiService = new (require('../services/feTi.service'));

class RawMaterialService {
    constructor() {
        this.model = RawMaterialModel;
    }

    async get() {
        return this.model.find().sort(`-created_at`);
    }
    async getById(id) {
        return this.model.findOne({ id: id });
    }

    async addRawMaterialsToDb(payload) {
        try {
            const addedRawMaterials = await this.model.create(payload);
            return addedRawMaterials;
        } catch (err) {
            if (err.keyPattern) {
                throw ({ statusCode: 400, message: `Raw Material already exists` })
            }
            throw ({ statusCode: 500, message: { err: err } })
        }
    }
    async updateRawMaterials(newRawMaterials) {
        try {
            const products = await FeTiService.get();
            const ratios = [
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.470588, 0.235294, 0.141176, 0.152941], // Product 1
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.298851, 0.426230, 0.127660, 0.147457], // Product 2
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.347826, 0.086957, 0.130435, 0.434783], // Product 3
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000],  // Product 4
                [0.350000, 0.150000, 0.150000, 0.350000]  // Product 4
            ];

            const dbRawMaterials = await this.get();

            for (let i = 0; i < dbRawMaterials.length; i++) {
                dbRawMaterials[i].stockCount += newRawMaterials[i];
                await dbRawMaterials[i].save();
            }
            console.log("dbr", dbRawMaterials)
            let rawMat = [];
            dbRawMaterials.forEach(mat => {
                rawMat.push(mat.stockCount)
            })
            console.log("rawMat", rawMat)
            // Calculate the maximum quantity of each product that can be made
            const { productQuantities, remainingRawMaterials } = this.calculateProductQuantities(ratios, rawMat);
            products.forEach((product, prodIndex) => {
                let qunatities = [];
                if (prodIndex == 0) {
                    qunatities = productQuantities.slice(0, 8);
                } else if (prodIndex == 1) {
                    qunatities = productQuantities.slice(8, 16);
                } else if (prodIndex == 2) {
                    qunatities = productQuantities.slice(16, 24);
                } else if (prodIndex == 3) {
                    qunatities = productQuantities.slice(24, 32);
                }
                // Iterate over each subgrade of the product
                product.subGrades.forEach((subGrade, subIndex) => {
                    let subQuant = []
                    if (subIndex == 0) {
                        subQuant = qunatities.slice(0, 4);
                    } else if (subIndex == 1) {
                        subQuant = qunatities.slice(4, 8);
                    }
                    console.log("next grade", subQuant)
                    // Iterate over each size of the subgrade
                    subGrade.sizes.forEach((size, sizeIndex) => {
                        // Calculate the new stockCount for the size
                        console.log("wyuantittt", sizeIndex, subQuant[sizeIndex])
                        // Update the stockCount for the size
                        size.stockCount = subQuant[sizeIndex].quantity >= 0 ? subQuant[sizeIndex].quantity : 0;
                    });
                });

                // Save the updated product
                product.save();
            });
            return { productQuantities, remainingRawMaterials };
        } catch (err) {
            if (err.keyPattern) {
                throw ({ statusCode: 400, message: `Raw Material already exists` })
            }
            throw ({ statusCode: 500, message: { err: err } })
        }
    }

    calculateProductQuantities(ratios, availableRawMaterials) {
        const numProducts = ratios.length;
        const numRawMaterials = availableRawMaterials.length;

        // Calculate the maximum quantity for each product based on available raw materials and ratios
        const productQuantities = new Array(numProducts).fill(Infinity);

        for (let i = 0; i < numProducts; i++) {
            for (let j = 0; j < numRawMaterials; j++) {
                const quantity = Math.floor(availableRawMaterials[j] / ratios[i][j]);
                productQuantities[i] = Math.min(productQuantities[i], quantity);
            }
        }

        // Find the minimum quantity among all products
        const minQuantity = Math.min(...productQuantities);

        // Calculate the total required raw materials for producing the minimum quantity for all products
        const totalRequiredRawMaterials = ratios.reduce((total, ratio) => total + ratio.reduce((sum, val) => sum + val, 0), 0) * minQuantity;

        // Calculate the scaling factor based on the available raw materials
        const scalingFactor = totalRequiredRawMaterials > 0 ? Math.min(1, availableRawMaterials.reduce((min, quantity) => Math.min(min, quantity), Infinity) / totalRequiredRawMaterials) : 1;

        // Scale down the product quantities proportionally
        const equalQuantities = productQuantities.map(quantity => Math.floor(quantity * scalingFactor));

        // Calculate remaining raw materials
        const remainingRawMaterials = availableRawMaterials.map((quantity, index) => {
            const usedQuantity = equalQuantities.reduce((total, quantity, idx) => total + (ratios[idx][index] * quantity), 0);
            return quantity - usedQuantity;
        });

        return {
            productQuantities: equalQuantities.map((quantity, index) => ({
                product: index + 1,
                quantity
            })),
            remainingRawMaterials
        };
    }
    // function calculateMaxQuantityAndRemainingForProducts(ratios, availableRawMaterials, productIndices) {
    //     const numProducts = ratios.length;
    //     const numRawMaterials = availableRawMaterials.length;

    //     let maxQuantities = new Array(numProducts).fill(Infinity);

    //     productIndices.forEach(productIndex => {
    //         const productRatios = ratios[productIndex];
    //         let productMaxQuantity = Infinity;

    //         for (let j = 0; j < numRawMaterials; j++) {
    //             const quantity = Math.floor(availableRawMaterials[j] / productRatios[j]);
    //             productMaxQuantity = Math.min(productMaxQuantity, quantity);
    //         }

    //         maxQuantities[productIndex] = productMaxQuantity;
    //     });

    //     // Calculate total raw materials used by selected products
    //     const totalRawMaterialsUsed = productIndices.reduce((total, index) => {
    //         const productRatios = ratios[index];
    //         return total + productRatios.reduce((acc, ratio, idx) => acc + ratio * maxQuantities[index], 0);
    //     }, 0);

    //     // Adjust max quantities to ensure total raw materials used don't exceed available quantity
    //     const adjustmentFactor = Math.min(1, availableRawMaterials.reduce((acc, quantity, idx) => acc + quantity, 0) / totalRawMaterialsUsed);
    //     maxQuantities = maxQuantities.map(quantity => Math.floor(quantity * adjustmentFactor));

    //     // Calculate remaining raw materials
    //     const remainingRawMaterials = availableRawMaterials.map((quantity, idx) => quantity - productIndices.reduce((total, index) => {
    //         const productRatios = ratios[index];
    //         return total + productRatios[idx] * maxQuantities[index];
    //     }, 0));

    //     return {
    //         maxQuantities,
    //         remainingRawMaterials
    //     };
    // }
}


module.exports = RawMaterialService 

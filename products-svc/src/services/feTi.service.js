const FeTiModel = require('../models/feTiProducts.model')

class FeTiService {
    constructor() {
        this.model = FeTiModel;
    }

    async get() {
        return this.model.find().sort(`-created_at`);
    }
    async getById(id) {
        return this.model.findOne({ id: id });
    }

    async addFeTiGrade(payload) {
        try {
            const newFeTiProduct = await this.model.create(payload);
            return newFeTiProduct;
        } catch (err) {
            if (err.keyPattern) {
                throw ({ statusCode: 400, message: `Product already exists` })
            }
            throw ({ statusCode: 500, message: { err: err } })
        }
    }

}


module.exports = FeTiService 

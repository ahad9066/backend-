const cartModel = require('../models/cart.model')

class CartService {
    constructor() {
        this.model = cartModel;
    }

    async findByUser(userId) {
        const userCart = await this.model.findOne({ userId: userId });
        if (!userCart) {
            return {
                userId: userId,
                cartItems: []
            }
        }
        return userCart;
    }
    async addToCart(payload) {
        try {
            const user = await this.model.findOne({ userId: payload.userId });
            if (!user) {
                const newFeTiProduct = await this.model.create(payload);
                return newFeTiProduct;
            } else {
                const updatedCart = await this.model.findOneAndUpdate(
                    { userId: payload.userId },
                    { cartItems: payload.cartItems },
                    { new: true }
                );
                return updatedCart;
            }

        } catch (err) {
            throw ({ statusCode: 500, message: { err: err } })
        }
    }

    async deleteByUserId(userId) {
        try {
            const result = await this.model.deleteOne({ userId: userId });
            return result;
        } catch (err) {
            throw { statusCode: 500, message: { err: err } };
        }
    }


}


module.exports = CartService 

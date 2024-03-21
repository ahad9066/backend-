const cartModel = require('../models/cart.model')
const axios = require("axios");

const client = axios.create({
    baseURL: process.env.AUTH_API_BASE_URL,
});
class CartService {
    constructor() {
        this.model = cartModel;
    }

    async getAllCarts(token) {
        const cartItems = await this.model.find().sort(`-created_at`).lean();
        console.log("Carr", cartItems)
        const userIds = cartItems.map(item => item.userId);
        const requestBody = {
            userIds: userIds
        };
        console.log("userIds", userIds)
        const userDetails = await client.request({
            url: `/users/selectedUsers`,
            method: 'post',
            headers: { Authorization: token, type: 'isEmployee' },
            data: requestBody
        });
        console.log("user", userDetails.data.users)
        const mergedItems = cartItems.map(cartItem => {
            const userDetail = userDetails.data.users.find(user => user._id === cartItem.userId);
            return {
                ...cartItem,
                userDetails: userDetail
            };
        });
        return mergedItems;
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

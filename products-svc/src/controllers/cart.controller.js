const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const CartService = new (require("../services/cart.service"));

const serializers = require("../serializers");

const _ = require('lodash')



exports.addToCart = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.cart.cartSchema,
            req.body
        );
        const added_cartItems = await CartService.addToCart(payload);
        res.json(serializers.cart(added_cartItems))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getUserCartItems = async (req, res, next) => {
    try {
        const userCartItems = await CartService.findByUser(req.params['id']);
        res.status(200).json(serializers.cart(userCartItems));
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getAllUserCartItems = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        if (token) {
            token = token.replace('Bearer ', '');
        }
        const userCartItems = await CartService.getAllCarts(token);
        console.log("userCartItems", userCartItems)
        // res.status(200).json(serializers.cart(userCartItems));
        res.status(200).json({
            cartList: userCartItems,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteUserCartItems = async (req, res, next) => {
    try {
        const userCartItems = await CartService.deleteByUserId(req.params['id']);
        res.status(200).json({
            "message": "Deleted successfully"
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
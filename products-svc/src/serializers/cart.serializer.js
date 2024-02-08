module.exports = (cart) => {
    const serializedCart = {
        user: cart.userId,
        cartItems: cart.cartItems.map(item => ({
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
    }
    return serializedCart;
}
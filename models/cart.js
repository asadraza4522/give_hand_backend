const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productID: {
        type: String,
        ref: 'products',
        required: true
    },
    cartQty: {
        type: Number,
        required: true
    }
}, { _id: false })

const CartSchema = new Schema({

    products: {
        type: [ProductSchema],
        required: true
    },
    amount: {
        type: Number,
        required: true
    }

}, { _id: false })

const UserCart = new Schema({

    user: {
        type: String,
        required: true,
        ref: 'user',
    },
    cart: {
        required: true,
        type: CartSchema
    }


});


const UsersCarts = mongoose.model('cart', UserCart)

module.exports = UsersCarts;
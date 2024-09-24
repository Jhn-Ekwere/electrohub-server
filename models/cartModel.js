const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
   
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

cartSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

cartSchema.set("toJSON", {
    virtuals: true,
    });
 

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
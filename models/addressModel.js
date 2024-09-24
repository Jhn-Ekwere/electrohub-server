const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
 
});

addressSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

addressSchema.set("toJSON", {
  virtuals: true,
});
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
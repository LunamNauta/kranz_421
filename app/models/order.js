const mongoose = require('mongoose');

const order_schema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    modifications: { type: String }
});

const Order = mongoose.model('Order', order_schema);

module.exports = Order;
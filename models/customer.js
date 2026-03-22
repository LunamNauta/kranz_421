const mongoose = require('mongoose');

const customer_schema = new mongoose.Schema({
    name: { type: String, required: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const Customer = mongoose.model('Customer', customer_schema);

module.exports = Customer;
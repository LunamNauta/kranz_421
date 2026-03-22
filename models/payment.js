const mongoose = require('mongoose');

const payment_schema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    order_name: { type: String, required: true },
    order_price: { type: Number, required: true},
})

const Payment = mongoose.model('Payment', payment_schema);

module.exports = Payment;
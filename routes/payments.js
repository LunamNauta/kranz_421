const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Payment = require('../models/payment');
const Order = require('../models/order');

async function get_payments(req, res){
    try{
        const payments = await Payment.find();
        res.status(200).json(payments);
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
}

async function create_payments(req, res){
    try{
        const order = await Order.findById(req.params.id);
        if (order == null){
            res.status(404).json({ message: "Failed to perform payment. Referenced order does not exist" });
            return;
        }

        // Should never happen. Backend logic should prevent this situation
        const customer = await Customer.findById(order.customer_id);
        if (customer == null){
            res.status(404).json({ message: "Failed to perform payment. Order was orphaned" });
            return;
        }

        await new Promise((res) => setTimeout(res, (Math.random() * (5000 - 500)) + 500));

        const payment = await Payment.create({
            customer_name: customer.name,
            order_name: order.name,
            order_price: order.price
        });

        const response = await fetch(`http://localhost:${process.env.PORT}/orders/` + req.params.id, {
            method: "DELETE"
        });
        if (!response.ok){
            res.status(response.status).json(await response.json());
            return;
        }

        res.status(201).json(payment);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

async function delete_payments(req, res){
    try{
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (payment == null){
            res.status(404).json({ message: "Failed to delete payment. Referenced payment does not exist" });
            return;
        }
        
        res.status(200).json({ message: 'Payment deleted' });
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

// Get all payments
router.get('/', get_payments);

// Create a new payment
router.post('/:id', create_payments);
// Delete a payment
router.delete('/:id', delete_payments);

module.exports = router;

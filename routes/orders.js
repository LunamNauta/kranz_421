const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Customer = require('../models/customer');


// Create a new order
router.post('/', async (req, res) => {
    try{
        const new_order = await Order.create(req.body);
        /*
        const customer = await Customer.findByIdAndUpdate(
            req.body["customer_id"],
            { $push: { orders: new_order["_id"] } }
        );
        customer.save();
        */
        res.status(201).json(new_order);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try{
        const orders = await Order.find();
        res.json(orders);
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
});

// Update an order
router.patch('/:id', async (req, res) => {
    try{
        const updated_order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated_order);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
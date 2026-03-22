const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Order = require('../models/order');

async function get_orders(req, res){
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
}

async function process_orders(req, res){
    try{
        const customer = await Customer.findById(req.body.customer_id);
        if (customer == null){
            res.status(404).json({ message: "Failed to create order. Referenced customer does not exist" });
            return;
        }

        const order = await Order.create(req.body);
        customer.orders.push(order._id);
        await customer.save();

        res.status(201).json(order);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

async function update_orders(req, res){
    if (req.body.customer_id != null){
        const customer = await Customer.findById(req.body.customer_id);
        if (customer == null){
            res.status(404).json({ message: "Failed to update order. Referenced customer does not exist" });
            return;
        }
    }

    try{
        const order = await Order.findByIdAndUpdate(req.params.id, req.body);
        if (order == null){
            res.status(404).json({ message: "Failed to update order. Referenced order does not exist" });
            return;
        }

        if (req.body.customer_id){
            await Customer.findByIdAndUpdate(
                order.customer_id,
                { $pull: { orders: req.params.id } },
            );
            await Customer.findByIdAndUpdate(
                req.body.customer_id,
                { $addToSet: { orders: order._id } },
            );
        }

        res.status(200).json(order);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

async function delete_orders(req, res){
    try{
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order == null){
            res.status(404).json({ message: "Failed to delete order. Referenced order does not exist" });
            return;
        }

        await Customer.findByIdAndUpdate(
            order.customer_id,
            { $pull: { orders: order._id } },
        );
        
        res.status(200).json(order);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

// Get all orders
router.get('/', get_orders);
// Create a new order
router.post('/', process_orders);

// Update an order
router.patch('/:id', update_orders);
// Delete an order
router.delete('/:id', delete_orders);

module.exports = router;
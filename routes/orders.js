const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Order = require('../models/order');

// Create a new order
router.post('/', async (req, res) => {
    try{
        console.log("---- Create Order ----");

        console.log("Getting customer...");
        const customer = await Customer.findById(req.body["customer_id"],);
        if (customer == null){
            res.status(404).json({ message: "Failed to create order. Referenced customer does not exist" });
            console.log("Failed.");
            console.log("----------------\n");
            return;
        }
        console.log("Done.\n");

        console.log("Creating order...");
        const order = await Order.create(req.body);
        console.log("Done.\n");
        
        console.log("Adding order to customer...");
        customer.orders.push(order["_id"]);
        await customer.save();
        console.log("Done.");
        console.log("----------------\n");

        res.status(201).json(order);
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
        console.log("---- Update Order ----");

        if (req.body["customer_id"] != null){
            console.log("Checking if customer exists\n");
            const customer = await Customer.findById(req.body["customer_id"]);
            if (customer == null){
                res.status(404).json({ message: "Failed to update order. Referenced customer does not exist" });
                console.log("Failed.");
                console.log("----------------\n");
                return;
            }
            console.log("Done.\n");
        }

        console.log("Updating order...");
        const order = await Order.findByIdAndUpdate(req.params.id, req.body);
        if (order == null){
            res.status(404).json({ message: "Failed to update order. Referenced order does not exist" });
            console.log("Failed.");
            console.log("----------------\n");
            return;
        }
        console.log("Done.");

        if (req.body["customer_id"]){
            console.log("\nRemoving order from old customer...");
            await Customer.findByIdAndUpdate(
                order["customer_id"],
                { $pull: { orders: req.params.id } },
            );
            console.log("Done.\n");

            console.log("Adding order to new customer...");
            await Customer.findByIdAndUpdate(
                req.body["customer_id"],
                { $addToSet: { orders: order["_id"] } },
            );
            console.log("Done.");
        }
        console.log("----------------\n");

        res.json(order);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try{
        console.log("---- Delete Order ----");

        console.log("Removing order...");
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order == null){
            res.status(404).json({ message: "Failed to delete order. Referenced order does not exist" });
            return;
        }
        console.log("Done.\n");

        console.log("Removing order from customer...");
        await Customer.findByIdAndUpdate(
            order.customer_id,
            { $pull: { orders: order["_id"] } },
        );
        console.log("Done.");
        console.log("----------------\n");
        
        res.json({ message: 'Order deleted' });
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
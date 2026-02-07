const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Payment = require('../models/payment');
const Order = require('../models/order');

// Create a new payment
router.post('/:id', async (req, res) => {
    try{
        console.log("---- Perform Payment ----");

        console.log("Getting order...");
        const order = await Order.findById(req.params.id);
        if (order == null){
            res.status(404).json({ message: "Failed to perform payment. Referenced order does not exist" });
            console.log("Failed.")
            console.log("----------------\n");;
            return;
        }
        console.log("Done.\n");

        console.log("Getting customer...");
        const customer = await Customer.findById(order["customer_id"]);
        if (customer == null){
            res.status(404).json({ message: "Failed to perform payment. Order was orphaned" });
            console.log("Failed.");
            console.log("----------------\n");
            return;
        }
        console.log("Done.\n");

        await new Promise((res) => setTimeout(res, (Math.random() * (5000 - 500)) + 500));
        console.log("Processing payment...");
        const payment = await Payment.create({
            customer_name: customer["name"],
            order_name: order["name"],
            order_price: order["price"]
        });
        console.log("Done.\n");

        console.log("Removing order from customers...");
        const response = await fetch("http://localhost:3000/orders/" + req.params.id, {
            method: "DELETE"
        });
        if (!response.ok){
            res.status(response.status).json(await response.json());
            console.log("Failed.");
            console.log("----------------\n");
            return;
        }
        console.log("Done.");
        console.log("----------------\n");

        res.status(201).json(payment);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Get all payments
router.get('/', async (req, res) => {
    try{
        const payments = await Payment.find();
        res.json(payments);
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
    try{
        console.log("---- Delete Payment ----");

        console.log("Removing Payment...");
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (payment == null){
            res.status(404).json({ message: "Failed to delete payment. Referenced payment does not exist" });
            console.log("Failed.");
            console.log("----------------\n");;
            return;
        }
        console.log("Done.");
        console.log("----------------\n");;
        
        res.json({ message: 'Payment deleted' });
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
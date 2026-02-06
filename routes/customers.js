const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Order = require('../models/order');

// Create a new customer
router.post('/', async (req, res) => {
    try{
        if (req.body["orders"] != null){
            res.status(400).json({ message: "Failed to create customer. Cannot assign orders. PATCH or POST order to add order to customer" });
            return;
        }

        const customer = await Customer.create(req.body);

        res.status(201).json(customer);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Get all customers
router.get('/', async (req, res) => {
    try{
        const customers = await Customer.find();
        res.json(customers);
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
});

// Update a customer
router.patch('/:id', async (req, res) => {
    try{
        if (req.body["orders"] != null){
            res.status(400).json({ message: "Failed to update customer. Cannot assign orders. PATCH or POST order to add order to customer" });
            return;
        }

        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body);
        if (customer == null){
            res.status(404).json({ message: "Failed to update customer. Referenced customer does not exist" });
            return;
        }

        res.json(customer);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    try{
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (customer == null){
            res.status(404).json({ message: "Failed to delete customer. Referenced customer does not exist" });
            return;
        }
        
        for (let order of customer.orders){
            await Order.findByIdAndDelete(order);
        }
        
        res.json({ message: 'Customer deleted' });
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');

async function get_customers(req, res){
    try{
        const customers = await Customer.find();
        res.status(200).json({customers});
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
}

async function create_customers(req, res){
    if (req.body.orders != null){
        res.status(400).json({ message: "Failed to create customer. Cannong assign orders. PATCH or POST order to add order to customer" });
        return;
    }

    try{
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

async function update_customers(req, res){
    if (req.body.orders != null){
        res.status(400).json({ message: "Failed to create customer. Cannong assign orders. PATCH or POST order to add order to customer" });
        return;
    }

    try{
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body);
        if (customer == null){
            res.status(404).json({ message: "Failed to update customer. Referenced customer does not exist" });
            return;
        }
        res.status(200).json(customer);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

async function delete_customers(req, res){
    try{
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (customer == null){
            res.status(404).json({ message: "Failed to delete customer. Referenced customer does not exist" });
            return;
        }
        res.status(200).json(customer);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
}

// Get all customers
router.get('/', get_customers);
// Create a new customer
router.post('/', create_customers);

// Update a customer
router.patch('/:id', update_customers);
// Delete a customer
router.delete('/:id', delete_customers);

module.exports = router;
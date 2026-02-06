const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Create a new customer
router.post('/', async (req, res) => {
    try{
        const new_customer = await Customer.create(req.body);
        res.status(201).json(new_customer);
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
        const updated_customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated_customer);
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    try{
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Customer deleted' });
    }
    catch (err){
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
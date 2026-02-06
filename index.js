const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost/mydatabase', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
const customers_router = require('./routes/customers');
app.use('/customers', customers_router);
const orders_router = require('./routes/orders');
app.use('/orders', orders_router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
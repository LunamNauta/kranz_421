const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swagger_ui = require('swagger-ui-express');
const yamljs = require('yamljs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://host.docker.internal/mydatabase', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB\n');
});

// Routes
const swagger_document = yamljs.load('./docs/openapi.yaml');
app.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_document));

const customers_router = require('./routes/customers');
app.use('/customers', customers_router);

const orders_router = require('./routes/orders');
app.use('/orders', orders_router);

const payments_router = require('./routes/payments');
app.use('/payments', payments_router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n`);
});
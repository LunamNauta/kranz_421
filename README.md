# Ordering API

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)  

The **Ordering API** allows management of customers, orders, and payments. It provides endpoints to create, update, retrieve, and delete resources, following RESTful principles.  

## Table of Contents

2. [Getting Started](#-getting-started)  
3. [API Endpoints](#-api-endpoints)  

## Getting Started

### Prerequisites

- **Node.js** ≥ 25.6.0
- **npm** ≥ 11.8.0
- **MongoDB**

### Installation

```bash
# Clone the repository
git clone https://github.com/LunamNauta/kranz_421.git
cd kranz_421/app

# Install dependencies
npm install
```

### Running

```bash
# Assuming *Installation* was followed
node index.js
```

### Testing
```bash
Import ./testing/postman_collection.json to a postman collection
Add ./testing/postman_data.json as "test data file"
Run Ordering API
```

## API Endpoints

### Swagger Documentation
#### /api-docs

### Customers

| Method | Endpoint                   | Description           |
|--------|----------------------------|-----------------------|
| GET    | `/customers`               | Get all customers     |
| POST   | `/customers`               | Create a new customer |
| PATCH  | `/customers/{customer_id}` | Update a customer     |
| DELETE | `/customers/{customer_id}` | Delete a customer     |

### Orders

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | `/orders`            | Get all orders     |
| POST   | `/orders`            | Create a new order |
| PATCH  | `/orders/{order_id}` | Update an order    |
| DELETE | `/orders/{order_id}` | Delete an order    |

### Payments

| Method | Endpoint               | Description       |
|--------|------------------------|-------------------|
| GET    | `/payments`            | Get all payments  |
| POST   | `/payments/{order_id}` | Perform a payment |
| DELETE | `/payments/{order_id}` | Delete a payment  |
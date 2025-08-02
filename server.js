// server.js
const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');

// FIX: Load environment variables from .env file for local development
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// FIX: Initialize Razorpay instance from secure environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create an endpoint for creating orders
app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt } = req.body;
    const options = {
        amount, // amount in the smallest currency unit
        currency,
        receipt
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send(error.message || 'Error creating order');
    }
});

// FIX: Use the port from the environment file or deployment service, defaulting to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

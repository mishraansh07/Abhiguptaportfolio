// server.js
const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use this to allow requests from your frontend

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_live_Li41DPoYeGyRPm',
    key_secret: 'cDYWtxeQvARhEfedhTzjczfA'
});

// Create an endpoint for creating orders
app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt } = req.body;

    const options = {
        amount: amount, // amount in the smallest currency unit
        currency: currency,
        receipt: receipt
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order); // Send the created order back to the client
    } catch (error) {
        // Add more detailed error logging
        console.error("Error creating Razorpay order:", error);
        res.status(500).send(error.message || 'Error creating order');
    }
});

// Change the port number here
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});

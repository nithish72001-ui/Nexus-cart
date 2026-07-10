const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// @desc    Process a checkout and save the order to MySQL
// @route   POST /api/orders
router.post('/', async (req, res) => {
    const { cartItems, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cannot checkout with an empty cart' });
    }

    try {
        // 1. Insert into orders table matching our new database structure
        const [orderResult] = await db.query(
            'INSERT INTO orders (total_amount) VALUES (?)',
            [parseFloat(totalAmount)]
        );

        const newOrderId = orderResult.insertId;

        // 2. Insert each item from the shopping basket one by one
        for (const item of cartItems) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [parseInt(newOrderId), parseInt(item.id), parseInt(item.qty), parseFloat(item.price)]
            );
        }

        return res.status(201).json({
            success: true,
            message: 'Checkout complete!',
            orderId: newOrderId
        });

    } catch (error) {
        console.log("\n❌ [DATABASE CRASH]:", error.message, "\n");
        return res.status(500).json({ message: 'Internal server error processing transaction' });
    }
});

module.exports = router;
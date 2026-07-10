const express = require('express');
const cors = require('cors');
const { db } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ================= CRITICAL MIDDLEWARE =================
// Crucial to accept cross-origin requests from your frontend (port 5173)
app.use(cors());

// CRITICAL: This MUST be placed before routes to parse incoming req.body json payloads!
app.use(express.json());

// ================= API ROUTES =================

// 1. Get all products catalog
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching products:', error.message);
        res.status(500).json({ message: 'Database failed to return products list.' });
    }
});

// 2. Submit a new checkout order
app.post('/api/orders', async (req, res) => {
    // Universal extraction to safely read 'cart', 'items', or 'products' array keys
    const incomingCart = req.body.items || req.body.cart || req.body.products || req.body.array;

    // Strict validation check to guard database entries
    if (!incomingCart || !Array.isArray(incomingCart) || incomingCart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    try {
        // Calculate dynamic total cost safe calculation directly on server records
        const totalAmount = incomingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Insert into orders overview table tracker
        const [orderResult] = await db.query(
            'INSERT INTO orders (total_amount) VALUES (?)',
            [totalAmount]
        );

        const newOrderId = orderResult.insertId;

        // Map and insert item lines sequentially into relationship order matching items mapping table
        for (const item of incomingCart) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [newOrderId, item.id, item.quantity, item.price]
            );
        }

        console.log(`🚀 Order #${newOrderId} processed successfully for total ₹${totalAmount}`);
        res.status(201).json({
            orderId: newOrderId,
            message: 'Order placed cleanly!'
        });

    } catch (error) {
        console.error('❌ Order insertion process transaction failed:', error.message);
        res.status(500).json({ message: 'Database failure running transactions.' });
    }
});

// ================= START BACKEND SERVER =================
app.listen(PORT, () => {
    console.log(`\n🚀 Store Backend Server Running Fresh On Port ${PORT}`);
    console.log(`🔗 API Active: http://localhost:${PORT}/api/products`);
    console.log(`🔗 API Active: http://localhost:${PORT}/api/orders\n`);
});
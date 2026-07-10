const express = require('express');
const router = express.Router();
const {db} = require('../config/db.js'); // Import our MySQL pool

// @desc    Get all products from MySQL
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT id as _id, name, description, price, image FROM products');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching products from MySQL' });
    }
});

module.exports = router;
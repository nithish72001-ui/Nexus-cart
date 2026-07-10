const { db } = require('./config/db');

const sampleProducts = [
    {
        name: 'Premium Wireless Headphones',
        description: 'High-fidelity audio with active noise cancellation and a comfortable 40-hour battery life.',
        price: 14999.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    {
        name: 'Minimalist Mechanical Keyboard',
        description: 'Compact 65% layout featuring tactile brown switches and elegant RGB backlighting.',
        price: 6499.00,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'
    },
    {
        name: 'Ergonomic Wireless Mouse',
        description: 'Precision tracking sensor with side scroll wheels designed to maximize daily productivity.',
        price: 4299.00,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400'
    },
    {
        name: 'Ultra-Wide Gaming Monitor',
        description: '34-inch curved display panel featuring an immersive 144Hz refresh rate and 1ms response time.',
        price: 28999.00,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
    },
    {
        name: 'Smart Fitness Watch Pro',
        description: 'AMOLED display featuring continuous heart-rate tracking, localized GPS maps, and 14-day battery run.',
        price: 8999.00,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'
    },
    {
        name: '4K Ultra-HD Streaming Webcam',
        description: 'Pro webcam featuring low-light auto-correction adjustments and dual noise-canceling built-in mics.',
        price: 5499.00,
        image: 'https://images.unsplash.com/photo-1603184017968-953f59cd2e37?w=400'
    },
    {
        name: 'Smart Home Security Camera',
        description: '1080p indoor Wi-Fi camera with night vision, motion detection alerts, and two-way audio talk.',
        price: 2999.00,
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400'
    },
    {
        name: 'RGB Gaming Desktop Speakers',
        description: 'Dual channel multi-media desktop setup featuring cycling dynamic color audio-sync reactive wave backlights.',
        price: 2499.00,
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'
    },
    {
        name: 'Smart Coffee Mug Warmer',
        description: 'Desktop electric beverage heater coaster with automatic shut-off safety controls and customizable temperatures.',
        price: 1599.00,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400'
    }
];

const seedDatabase = async () => {
    try {
        console.log('Connecting to MySQL for seeding...');

        // Clear out the tables cleanly to drop old item sets
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE order_items');
        await db.query('TRUNCATE TABLE products');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Old records flushed safely.');

        // Re-seed with the updated 9 items
        for (const product of sampleProducts) {
            await db.query(
                'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
                [product.name, product.description, product.price, product.image]
            );
        }

        console.log('🚀 Database updated cleanly! Removed the soundbar.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeder script failed:', error.message);
        process.exit(1);
    }
};

seedDatabase();
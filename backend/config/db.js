const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to promises so we can use async/await
const promisePool = pool.promise();

const connectDB = async () => {
    try {
        // Test the database connection
        await promisePool.query('SELECT 1');
        console.log('MySQL Connected successfully...');

        // Automatically create the products table if it doesn't exist yet
        await promisePool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(255) NOT NULL
      )
    `);
        console.log('Products table verified/created.');
    } catch (error) {
        console.error('MySQL Connection Failed:', error.message);
        process.exit(1);
    }
};

// Clean, unified export object matching the other files
module.exports = {
    db: promisePool,
    connectDB: connectDB
};
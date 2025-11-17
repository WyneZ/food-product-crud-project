import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(100) UNIQUE NOT NULL,
        product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('Perishable', 'Non-Perishable', 'Frozen', 'Canned', 'Beverage')),
        manufactured_date DATE NOT NULL,
        expired_date DATE NOT NULL,
        net_weight DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for product_id for faster lookups
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_product_id 
      ON products(product_id)
    `);

    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};
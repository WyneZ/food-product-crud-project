import { pool } from '../config/database';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';

export class ProductModel {
  async checkDuplicateProductId(productId: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT 1 FROM products WHERE product_id = $1',
      [productId]
    );
    return result.rows.length > 0;
  }

  async create(productData: CreateProductRequest): Promise<Product> {
    const { product_id, product_type, manufactured_date, expired_date, net_weight } = productData;
    
    const result = await pool.query(
      `INSERT INTO products (product_id, product_type, manufactured_date, expired_date, net_weight)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [product_id, product_type, manufactured_date, expired_date, net_weight]
    );

    return result.rows[0];
  }

  async findAll(): Promise<Product[]> {
    const result = await pool.query(`
      SELECT id, product_id, product_type, manufactured_date, expired_date, net_weight, created_at, updated_at
      FROM products 
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  async findById(id: number): Promise<Product | null> {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByProductId(productId: string): Promise<Product | null> {
    const result = await pool.query(
      'SELECT * FROM products WHERE product_id = $1',
      [productId]
    );
    return result.rows[0] || null;
  }

  async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    const { product_type, manufactured_date, expired_date, net_weight } = productData;
    
    const result = await pool.query(
      `UPDATE products 
       SET product_type = COALESCE($1, product_type),
           manufactured_date = COALESCE($2, manufactured_date),
           expired_date = COALESCE($3, expired_date),
           net_weight = COALESCE($4, net_weight),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [product_type, manufactured_date, expired_date, net_weight, id]
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1',
      [id]
    );
    return (result.rowCount || 0) > 0;
  }

  async getExpiredProducts(): Promise<Product[]> {
    const result = await pool.query(
      'SELECT * FROM products WHERE expired_date < CURRENT_DATE ORDER BY expired_date ASC'
    );
    return result.rows;
  }

  async getProductsExpiringSoon(days: number = 7): Promise<Product[]> {
    const result = await pool.query(
      `SELECT * FROM products 
       WHERE expired_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
       ORDER BY expired_date ASC`
    );
    return result.rows;
  }
}
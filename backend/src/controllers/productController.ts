import { Request, Response } from 'express';
import { ProductModel } from '../models/productModel';
import { CreateProductRequest, UpdateProductRequest } from '../types/product';

const productModel = new ProductModel();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const productData: CreateProductRequest = req.body;

      // Validate required fields
      if (!productData.product_id || !productData.product_type || 
          !productData.manufactured_date || !productData.expired_date || 
          productData.net_weight === undefined) {
        return res.status(400).json({
          error: 'All fields are required: product_id, product_type, manufactured_date, expired_date, net_weight'
        });
      }

      // Check for duplicate product_id
      const isDuplicate = await productModel.checkDuplicateProductId(productData.product_id);
      if (isDuplicate) {
        return res.status(409).json({
          error: 'Product ID already exists'
        });
      }

      // Validate dates
      const manufacturedDate = new Date(productData.manufactured_date);
      const expiredDate = new Date(productData.expired_date);
      
      if (isNaN(manufacturedDate.getTime()) || isNaN(expiredDate.getTime())) {
        return res.status(400).json({
          error: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      if (expiredDate <= manufacturedDate) {
        return res.status(400).json({
          error: 'Expired date must be after manufactured date'
        });
      }

      // Validate net weight
      if (productData.net_weight <= 0) {
        return res.status(400).json({
          error: 'Net weight must be greater than 0'
        });
      }

      const product = await productModel.create(productData);
      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productModel.findAll();
      res.json({
        products,
        count: products.length
      });
    } catch (error) {
      console.error('Get all products error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid product ID'
        });
      }

      const product = await productModel.findById(id);
      
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.json(product);
    } catch (error) {
      console.error('Get product by ID error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async getProductByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const product = await productModel.findByProductId(productId);
      
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.json(product);
    } catch (error) {
      console.error('Get product by product ID error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid product ID'
        });
      }

      const updateData: UpdateProductRequest = req.body;

      // Validate dates if provided
      if (updateData.manufactured_date || updateData.expired_date) {
        const manufacturedDate = updateData.manufactured_date ? new Date(updateData.manufactured_date) : null;
        const expiredDate = updateData.expired_date ? new Date(updateData.expired_date) : null;

        if ((manufacturedDate && isNaN(manufacturedDate.getTime())) || 
            (expiredDate && isNaN(expiredDate.getTime()))) {
          return res.status(400).json({
            error: 'Invalid date format. Use YYYY-MM-DD'
          });
        }

        if (manufacturedDate && expiredDate && expiredDate <= manufacturedDate) {
          return res.status(400).json({
            error: 'Expired date must be after manufactured date'
          });
        }
      }

      // Validate net weight if provided
      if (updateData.net_weight !== undefined && updateData.net_weight <= 0) {
        return res.status(400).json({
          error: 'Net weight must be greater than 0'
        });
      }

      const updatedProduct = await productModel.update(id, updateData);
      
      if (!updatedProduct) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.json({
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid product ID'
        });
      }

      const deleted = await productModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Product not found'
        });
      }

      res.json({
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async getExpiredProducts(req: Request, res: Response) {
    try {
      const expiredProducts = await productModel.getExpiredProducts();
      res.json({
        expiredProducts,
        count: expiredProducts.length
      });
    } catch (error) {
      console.error('Get expired products error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  async getProductsExpiringSoon(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const products = await productModel.getProductsExpiringSoon(days);
      res.json({
        products,
        count: products.length,
        days
      });
    } catch (error) {
      console.error('Get products expiring soon error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
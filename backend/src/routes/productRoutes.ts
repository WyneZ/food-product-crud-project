import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/id/:id', productController.getProductById);
router.get('/products/product-id/:productId', productController.getProductByProductId);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/expired', productController.getExpiredProducts);
router.get('/products/expiring-soon', productController.getProductsExpiringSoon);

export default router;
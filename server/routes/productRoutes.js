import express from 'express'
import {
  validateProduct,
  validateUpdateProduct,
} from '../middleware/productValidationMiddleware.js'
import {
  getProducts,
  getProduct,
  createProductController,
  updateProduct,
  patchProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { authorize } from '../middleware/authorizationMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateProduct,
  createProductController,
)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateProduct,
  updateProduct,
)
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validateUpdateProduct,
  patchProduct,
)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

export default router

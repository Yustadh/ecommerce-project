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
router.put('/:id', validateProduct, updateProduct)
router.patch('/:id', validateUpdateProduct, patchProduct)
router.delete('/:id', deleteProduct)

export default router

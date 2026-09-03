import express from 'express'
import { validateProduct } from '../middleware/productValidationMiddleware.js'
import {
  getProducts,
  getProduct,
  createProductController,
  updateProduct,
  patchProduct,
  deleteProduct,
} from '../controllers/productController.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', validateProduct, createProductController)
router.put('/:id', updateProduct)
router.patch('/:id', patchProduct)
router.delete('/:id', deleteProduct)

export default router

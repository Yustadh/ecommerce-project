import express from 'express'
import {
  getProducts,
  getProduct,
  createProductController,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', createProductController)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router

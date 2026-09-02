import express from 'express'
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
router.post('/', createProductController)
router.put('/:id', updateProduct)
router.patch('/:id', patchProduct)
router.delete('/:id', deleteProduct)

export default router

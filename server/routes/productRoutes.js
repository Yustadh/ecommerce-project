import express from 'express'
import {
  getProducts,
  getProduct,
  createProductController,
} from '../controllers/productController.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', createProductController)

export default router

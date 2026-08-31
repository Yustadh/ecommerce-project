import mongoose from 'mongoose'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
} from '../services/productService.js'

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts()

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve products',
      error: error.message,
    })
  }
}
export const getProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
      })
    }

    const product = await getProductById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve product',
      error: error.message,
    })
  }
}
export const createProductController = async (req, res) => {
  try {
    const product = await createProduct(req.body)

    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create product',
      error: error.message,
    })
  }
}
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid product ID',
      })
    }

    const product = await updateProductById(req.params.id, req.body)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update product',
      error: error.message,
    })
  }
}

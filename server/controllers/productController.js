import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  patchProductById,
  deleteProductById,
} from '../services/productService.js'

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts()

    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const createProductController = async (req, res, next) => {
  try {
    const product = await createProduct(req.body)

    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateProductById(req.params.id, req.body)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const patchProduct = async (req, res, next) => {
  try {
    const product = await patchProductById(req.params.id, req.body)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await deleteProductById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

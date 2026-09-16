import { parseProductFields } from '../utils/productQuery.js'
import { parsePagination } from '../utils/pagination.js'
import { parseSort } from '../utils/sorting.js'
import { parseProductFilters } from '../utils/productFilters.js'
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
    const filters = parseProductFilters(req.query)

    const { page, limit } = parsePagination(req.query.page, req.query.limit)

    const sort = parseSort(req.query.sort, req.query.order)

    const fields = parseProductFields(req.query.fields)

    const { products, total } = await getAllProducts(filters, {
      page,
      limit,
      sort,
      fields,
    })

    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
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

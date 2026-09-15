import { parseProductFields } from '../utils/productQuery.js'
import { parsePagination } from '../utils/pagination.js'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  patchProductById,
  deleteProductById,
} from '../services/productService.js'

const allowedSortFields = ['createdAt', 'name', 'price', 'stock']
const allowedSortOrders = ['asc', 'desc']

export const getProducts = async (req, res, next) => {
  try {
    const filters = {}

    if (req.query.category) {
      filters.category = req.query.category
    }

    if (req.query.search) {
      filters.name = {
        $regex: req.query.search,
        $options: 'i',
      }
    }

    if (req.query.minPrice !== undefined) {
      const minPrice = Number(req.query.minPrice)

      if (Number.isNaN(minPrice) || minPrice < 0) {
        return res.status(400).json({
          message: 'Invalid minPrice',
        })
      }

      filters.price = {
        ...filters.price,
        $gte: minPrice,
      }
    }

    if (req.query.maxPrice !== undefined) {
      const maxPrice = Number(req.query.maxPrice)

      if (Number.isNaN(maxPrice) || maxPrice < 0) {
        return res.status(400).json({
          message: 'Invalid maxPrice',
        })
      }

      filters.price = {
        ...filters.price,
        $lte: maxPrice,
      }
    }

    if (
      filters.price?.$gte !== undefined &&
      filters.price?.$lte !== undefined &&
      filters.price.$gte > filters.price.$lte
    ) {
      return res.status(400).json({
        message: 'minPrice cannot be greater than maxPrice',
      })
    }

    const { page, limit } = parsePagination(req.query.page, req.query.limit)

    const sortField = req.query.sort ?? 'createdAt'
    const sortOrder = req.query.order ?? 'desc'

    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        message: 'Invalid sort field',
      })
    }

    if (!allowedSortOrders.includes(sortOrder)) {
      return res.status(400).json({
        message: 'Invalid sort order',
      })
    }

    const sort = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
      _id: -1,
    }

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

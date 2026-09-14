import Product from '../models/productModel.js'

export const getAllProducts = async (
  filters = {},
  { page = 1, limit = 10, sort = { createdAt: -1, _id: -1 }, fields } = {},
) => {
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find(filters).select(fields).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filters),
  ])

  return {
    products,
    total,
  }
}

export const getProductById = async (id) => {
  return Product.findById(id)
}

export const createProduct = async (productData) => {
  return Product.create(productData)
}

export const updateProductById = async (id, productData) => {
  return Product.findByIdAndUpdate(id, productData, {
    returnDocument: 'after',
    runValidators: true,
  })
}

export const patchProductById = async (id, productData) => {
  return Product.findByIdAndUpdate(id, productData, {
    returnDocument: 'after',
    runValidators: true,
  })
}

export const deleteProductById = async (id) => {
  return Product.findByIdAndDelete(id)
}

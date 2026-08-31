import Product from '../models/productModel.js'

export const getAllProducts = async () => {
  return Product.find()
}

export const getProductById = async (id) => {
  return Product.findById(id)
}
export const createProduct = async (productData) => {
  return Product.create(productData)
}
export const updateProductById = async (id, productData) => {
  return Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  })
}

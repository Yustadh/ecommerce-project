import Product from '../models/productModel.js'

export const getAllProducts = async () => {
  return Product.find()
}
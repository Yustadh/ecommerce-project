import { getAllProducts } from '../services/productService.js'

export const getProducts = async (req, res) => {
  const products = await getAllProducts()

  res.json(products)
}
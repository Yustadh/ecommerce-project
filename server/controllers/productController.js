import { getAllProducts } from '../services/productService.js'

export const getProducts = (req, res) => {
  const products = getAllProducts()

  res.json(products)
}
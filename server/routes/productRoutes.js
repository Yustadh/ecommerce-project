import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Laptop',
      price: 1200,
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 100,
    },
    {
      id: 3,
      name: 'Smartphone',
      price: 800,
    },
  ]

  res.json(products)
})

export default router
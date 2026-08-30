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

export const getProducts = (req, res) => {
  res.json(products)
}
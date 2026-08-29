import express from 'express'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
const app = express()
const PORT = 5000
app.use(cors())
app.use('/api/products', productRoutes)
app.get('/', (req, res) => {
  res.send('E-commerce API is running')
})

app.get('/api/health', (req, res) => {
  res.send('E-Commerce API is healthy')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
import { connectDB } from './config/db.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

const app = express()
const PORT = 5000
app.use(express.json())
app.use(cors())

app.use('/api/products', productRoutes)

app.get('/', (req, res) => {
  res.send('E-commerce API is running')
})

app.get('/api/health', (req, res) => {
  res.send('API is healthy')
})
app.use(errorMiddleware)
connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

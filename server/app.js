import express from 'express'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('E-commerce API is running')
})

app.get('/api/health', (req, res) => {
  res.send('API is healthy')
})

app.use(errorMiddleware)

export default app

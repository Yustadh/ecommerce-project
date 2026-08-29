import express from 'express'
const app = express()
const PORT = 5000

app.get('/', (req, res) => {
  res.send('E-commerce API is running')
})
app.get('/api/products', (req, res) => {
  res.send('Our products API is running')
})
app.get('/api/health', (req, res) => {
  res.send('E-Commerce API is healthy')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

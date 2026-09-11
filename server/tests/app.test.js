import request from 'supertest'
import app from '../app.js'

describe('API health check', () => {
  test('GET /api/health should return API is healthy', async () => {
    const response = await request(app).get('/api/health')

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('API is healthy')
  })
})

describe('Product API', () => {
  test('GET /api/products should return an array of products', async () => {
    const response = await request(app).get('/api/products')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
  test('POST /api/products should create a new product', async () => {
  const newProduct = {
    name: 'Test Product',
    price: 99.99,
    category: 'Electronics',
    stock: 10,
  }

  const response = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(response.statusCode).toBe(201)
  expect(response.body.name).toBe(newProduct.name)
  expect(response.body.price).toBe(newProduct.price)
  expect(response.body.category).toBe(newProduct.category)
  expect(response.body.stock).toBe(newProduct.stock)
  expect(response.body._id).toBeDefined()
})
  test('POST /api/products should reject invalid product data', async () => {
  const invalidProduct = {
    name: '',
    price: -10,
    category: '',
    stock: -5,
  }

  const response = await request(app)
    .post('/api/products')
    .send(invalidProduct)

  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Validation failed')
  expect(response.body.errors).toEqual(
    expect.arrayContaining([
      'Name must be a non-empty string',
      'Price must be a non-negative number',
      'Category must be a non-empty string',
      'Stock must be a non-negative number',
    ]),
  )
})
  test('GET /api/products/:id should return a product', async () => {
  const newProduct = {
    name: 'Product Lookup Test',
    price: 149.99,
    category: 'Electronics',
    stock: 20,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const response = await request(app).get(`/api/products/${productId}`)

  expect(response.statusCode).toBe(200)
  expect(response.body._id).toBe(productId)
  expect(response.body.name).toBe(newProduct.name)
  expect(response.body.price).toBe(newProduct.price)
})
  test('GET /api/products/:id should return 404 for a non-existent product', async () => {
  const nonExistentId = '507f1f77bcf86cd799439011'

  const response = await request(app).get(
    `/api/products/${nonExistentId}`,
  )

  expect(response.statusCode).toBe(404)
  expect(response.body.message).toBe('Product not found')
})
  test('GET /api/products/:id should reject an invalid product ID', async () => {
  const response = await request(app).get('/api/products/not-a-valid-id')

  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Invalid product ID')
})
  test('PUT /api/products/:id should update an existing product', async () => {
  const newProduct = {
    name: 'Product Before Update',
    price: 100,
    category: 'Electronics',
    stock: 10,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const updatedProduct = {
    name: 'Product After Update',
    price: 150,
    category: 'Computers',
    stock: 20,
  }

  const response = await request(app)
    .put(`/api/products/${productId}`)
    .send(updatedProduct)

  expect(response.statusCode).toBe(200)
  expect(response.body._id).toBe(productId)
  expect(response.body.name).toBe(updatedProduct.name)
  expect(response.body.price).toBe(updatedProduct.price)
  expect(response.body.category).toBe(updatedProduct.category)
  expect(response.body.stock).toBe(updatedProduct.stock)
})
  test('PUT /api/products/:id should reject invalid product data', async () => {
  const newProduct = {
    name: 'PUT Validation Test',
    price: 100,
    category: 'Electronics',
    stock: 10,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const invalidProduct = {
    name: '',
    price: -50,
    category: '',
    stock: -10,
  }

  const response = await request(app)
    .put(`/api/products/${productId}`)
    .send(invalidProduct)

  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Validation failed')
  expect(response.body.errors).toEqual(
    expect.arrayContaining([
      'Name must be a non-empty string',
      'Price must be a non-negative number',
      'Category must be a non-empty string',
      'Stock must be a non-negative number',
    ]),
  )
})
  test('PATCH /api/products/:id should partially update an existing product', async () => {
  const newProduct = {
    name: 'PATCH Test Product',
    price: 200,
    category: 'Electronics',
    stock: 15,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const response = await request(app)
    .patch(`/api/products/${productId}`)
    .send({
      price: 250,
      stock: 25,
    })

  expect(response.statusCode).toBe(200)
  expect(response.body._id).toBe(productId)
  expect(response.body.name).toBe(newProduct.name)
  expect(response.body.price).toBe(250)
  expect(response.body.category).toBe(newProduct.category)
  expect(response.body.stock).toBe(25)
})
  test('PATCH /api/products/:id should reject an empty update', async () => {
  const newProduct = {
    name: 'Empty PATCH Test',
    price: 100,
    category: 'Electronics',
    stock: 10,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const response = await request(app)
    .patch(`/api/products/${productId}`)
    .send({})

  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Validation failed')
  expect(response.body.errors).toContain(
    'At least one field is required for an update',
  )
})
  test('PATCH /api/products/:id should reject unknown fields', async () => {
  const newProduct = {
    name: 'Unknown Field Test',
    price: 100,
    category: 'Electronics',
    stock: 10,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const response = await request(app)
    .patch(`/api/products/${productId}`)
    .send({
      discount: 20,
    })

  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Validation failed')
  expect(response.body.errors).toContain('Unknown field: discount')
})
  test('DELETE /api/products/:id should delete an existing product', async () => {
  const newProduct = {
    name: 'Delete Test Product',
    price: 50,
    category: 'Electronics',
    stock: 5,
  }

  const createResponse = await request(app)
    .post('/api/products')
    .send(newProduct)

  expect(createResponse.statusCode).toBe(201)

  const productId = createResponse.body._id

  const deleteResponse = await request(app).delete(
    `/api/products/${productId}`,
  )

  expect(deleteResponse.statusCode).toBe(204)
  expect(deleteResponse.body).toEqual({})

  const getResponse = await request(app).get(
    `/api/products/${productId}`,
  )

  expect(getResponse.statusCode).toBe(404)
  expect(getResponse.body.message).toBe('Product not found')
})
  test('DELETE /api/products/:id should return 404 for a non-existent product', async () => {
  const nonExistentId = '507f1f77bcf86cd799439011'

  const response = await request(app).delete(
    `/api/products/${nonExistentId}`,
  )

  expect(response.statusCode).toBe(404)
  expect(response.body.message).toBe('Product not found')
})
})
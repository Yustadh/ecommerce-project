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
  test('GET /api/products should return paginated products', async () => {
    const response = await request(app).get('/api/products')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.products)).toBe(true)
    expect(response.body.pagination).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 10,
      }),
    )
  })
  test('GET /api/products?page=1&limit=2 should return the requested number of products', async () => {
    await request(app).post('/api/products').send({
      name: 'Pagination Product 1',
      price: 100,
      category: 'PaginationPage1',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Pagination Product 2',
      price: 200,
      category: 'PaginationPage1',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Pagination Product 3',
      price: 300,
      category: 'PaginationPage1',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({
        category: 'PaginationPage1',
        page: 1,
        limit: 2,
      })
      .expect(200)

    expect(response.body.products).toHaveLength(2)
    expect(response.body.pagination).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
      }),
    )
  })

  test('GET /api/products?page=2&limit=2 should return the second page', async () => {
    await request(app).post('/api/products').send({
      name: 'Page Product 1',
      price: 100,
      category: 'PaginationPage2',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Page Product 2',
      price: 200,
      category: 'PaginationPage2',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Page Product 3',
      price: 300,
      category: 'PaginationPage2',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({
        category: 'PaginationPage2',
        page: 2,
        limit: 2,
      })
      .expect(200)

    expect(response.body.products).toHaveLength(1)
    expect(response.body.pagination).toEqual(
      expect.objectContaining({
        page: 2,
        limit: 2,
        total: 3,
        totalPages: 2,
      }),
    )
  })

  test('GET /api/products should return newest products first', async () => {
    const firstResponse = await request(app).post('/api/products').send({
      name: 'Older Product',
      price: 100,
      category: 'Sorting',
      stock: 10,
    })

    const secondResponse = await request(app).post('/api/products').send({
      name: 'Newer Product',
      price: 200,
      category: 'Sorting',
      stock: 10,
    })

    expect(firstResponse.statusCode).toBe(201)
    expect(secondResponse.statusCode).toBe(201)

    const response = await request(app)
      .get('/api/products')
      .query({
        category: 'Sorting',
        limit: 10,
      })
      .expect(200)

    expect(response.body.products[0].name).toBe('Newer Product')
    expect(response.body.products[1].name).toBe('Older Product')
  })

  test('GET /api/products?page should reject an invalid page', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 0 })
      .expect(400)

    expect(response.body.message).toBe('Invalid page')
  })

  test('GET /api/products?limit should reject an invalid limit', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ limit: 101 })
      .expect(400)

    expect(response.body.message).toBe('Invalid limit')
  })

  test('GET /api/products?category=Electronics should return only matching products', async () => {
    await request(app).post('/api/products').send({
      name: 'Test Phone',
      price: 500,
      category: 'Electronics',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Test Shirt',
      price: 50,
      category: 'Fashion',
      stock: 20,
    })

    const response = await request(app)
      .get('/api/products')
      .query({ category: 'Electronics' })
      .expect(200)

    expect(response.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Test Phone',
          category: 'Electronics',
        }),
      ]),
    )

    expect(
      response.body.products.every(
        (product) => product.category === 'Electronics',
      ),
    ).toBe(true)
  })
  test('GET /api/products?minPrice=100&maxPrice=500 should return products within price range', async () => {
    await request(app).post('/api/products').send({
      name: 'Budget Product',
      price: 50,
      category: 'Test',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Midrange Product',
      price: 300,
      category: 'Test',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Expensive Product',
      price: 800,
      category: 'Test',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({ minPrice: 100, maxPrice: 500 })
      .expect(200)

    expect(response.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Midrange Product',
          price: 300,
        }),
      ]),
    )

    expect(
      response.body.products.every(
        (product) => product.price >= 100 && product.price <= 500,
      ),
    ).toBe(true)
  })

  test('GET /api/products should combine category and price filters', async () => {
    await request(app).post('/api/products').send({
      name: 'Electronics Cheap',
      price: 50,
      category: 'CombinedFilter',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Electronics Midrange',
      price: 300,
      category: 'CombinedFilter',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Fashion Midrange',
      price: 300,
      category: 'Fashion',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Electronics Expensive',
      price: 800,
      category: 'CombinedFilter',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({
        category: 'CombinedFilter',
        minPrice: 100,
        maxPrice: 500,
      })
      .expect(200)

    expect(response.body.products).toHaveLength(1)
    expect(response.body.products[0]).toEqual(
      expect.objectContaining({
        name: 'Electronics Midrange',
        price: 300,
        category: 'CombinedFilter',
      }),
    )
  })
  test('GET /api/products should combine search and sorting', async () => {
    await request(app).post('/api/products').send({
      name: 'Samsung Galaxy A',
      price: 800,
      category: 'SearchSort',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Samsung Galaxy B',
      price: 500,
      category: 'SearchSort',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Wireless Keyboard',
      price: 100,
      category: 'SearchSort',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({
        search: 'samsung',
        sort: 'price',
        order: 'asc',
      })
      .expect(200)

    expect(response.body.products).toHaveLength(2)

    expect(response.body.products.map((product) => product.name)).toEqual([
      'Samsung Galaxy B',
      'Samsung Galaxy A',
    ])

    expect(response.body.products.map((product) => product.price)).toEqual([
      500, 800,
    ])
  })

  test('GET /api/products?minPrice should reject an invalid minimum price', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ minPrice: 'abc' })
      .expect(400)

    expect(response.body.message).toBe('Invalid minPrice')
  })

  test('GET /api/products should reject a minimum price greater than maximum price', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({
        minPrice: 500,
        maxPrice: 100,
      })
      .expect(400)

    expect(response.body.message).toBe(
      'minPrice cannot be greater than maxPrice',
    )
  })

  test('GET /api/products?search should return matching products case-insensitively', async () => {
    await request(app).post('/api/products').send({
      name: 'Samsung Galaxy Phone',
      price: 800,
      category: 'Electronics',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Wireless Keyboard',
      price: 100,
      category: 'Electronics',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({ search: 'samsung' })
      .expect(200)

    expect(response.body.products).toHaveLength(1)
    expect(response.body.products[0].name).toBe('Samsung Galaxy Phone')
  })

  test('GET /api/products?sort=price&order=asc should sort products by price ascending', async () => {
    await request(app).post('/api/products').send({
      name: 'Expensive Product',
      price: 900,
      category: 'sortingTest',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Cheap Product',
      price: 100,
      category: 'sortingTest',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({ category: 'sortingTest', sort: 'price', order: 'asc' })
      .expect(200)

    expect(response.body.products.map((product) => product.price)).toEqual([
      100, 900,
    ])
  })

  test('GET /api/products?sort=price&order=desc should sort products by price descending', async () => {
    await request(app).post('/api/products').send({
      name: 'Cheap Product',
      price: 100,
      category: 'sortingTestDesc',
      stock: 10,
    })

    await request(app).post('/api/products').send({
      name: 'Expensive ProductDesc',
      price: 900,
      category: 'sortingTestDesc',
      stock: 10,
    })

    const response = await request(app)
      .get('/api/products')
      .query({ category: 'sortingTestDesc', sort: 'price', order: 'desc' })
      .expect(200)

    expect(response.body.products.map((product) => product.price)).toEqual([
      900, 100,
    ])
  })
  test('GET /api/products?sort should reject an invalid sort field', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ sort: 'password' })
      .expect(400)

    expect(response.body.message).toBe('Invalid sort field')
  })
  test('GET /api/products?order should reject an invalid sort order', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ sort: 'price', order: 'random' })
      .expect(400)

    expect(response.body.message).toBe('Invalid sort order')
  })

  test('GET /api/products?fields should return only requested fields', async () => {
    await request(app).post('/api/products').send({
      name: 'Field Selection Product',
      price: 500,
      category: 'FieldSelection',
      stock: 15,
    })

    const response = await request(app)
      .get('/api/products')
      .query({
        category: 'FieldSelection',
        fields: 'name,price',
      })
      .expect(200)

    expect(response.body.products).toHaveLength(1)
    expect(response.body.products[0].name).toBe('Field Selection Product')
    expect(response.body.products[0].price).toBe(500)
    expect(response.body.products[0].category).toBeUndefined()
    expect(response.body.products[0].stock).toBeUndefined()
  })

  test('GET /api/products?fields should reject unknown fields', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ fields: 'name,password' })
      .expect(400)

    expect(response.body.message).toBe('Invalid fields')
  })

  test('GET /api/products?fields should reject an empty field selection', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ fields: '' })
      .expect(400)

    expect(response.body.message).toBe('Invalid fields')
  })

  test('POST /api/products should create a new product', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      category: 'Electronics',
      stock: 10,
    }

    const response = await request(app).post('/api/products').send(newProduct)

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

    const response = await request(app).get(`/api/products/${nonExistentId}`)

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

    const getResponse = await request(app).get(`/api/products/${productId}`)

    expect(getResponse.statusCode).toBe(404)
    expect(getResponse.body.message).toBe('Product not found')
  })
  test('DELETE /api/products/:id should return 404 for a non-existent product', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011'

    const response = await request(app).delete(`/api/products/${nonExistentId}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('Product not found')
  })
})

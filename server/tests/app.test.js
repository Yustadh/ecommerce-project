import request from 'supertest'
import app from '../app.js'

describe('API health check', () => {
  test('GET /api/health should return API is healthy', async () => {
    const response = await request(app).get('/api/health')

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('API is healthy')
  })
})
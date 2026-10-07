import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app.js'

describe('GET /api/auth/me', () => {
  const createToken = (overrides = {}) => {
    return jwt.sign(
      {
        sub: 'user-id-123',
        role: 'customer',
        ...overrides,
      },
      process.env.JWT_SECRET,
    )
  }

  test('should return the authenticated user', async () => {
    const token = createToken()

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: {
        id: 'user-id-123',
        role: 'customer',
      },
    })
  })

  test('should reject a request without a token', async () => {
    const response = await request(app).get('/api/auth/me')

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Authentication required',
    })
  })

  test('should reject an invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      message: 'Invalid or expired token',
    })
  })
})

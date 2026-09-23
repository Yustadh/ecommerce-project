import request from 'supertest'
import User from '../models/userModel.js'
import app from '../app.js'
import { verifyPassword } from '../utils/password.js'

describe('Registration API integration', () => {
  test('POST /api/auth/register should create a user successfully', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'John@Example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      message: 'Registration successful',
      user: {
        id: expect.anything(),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
      },
    })

    expect(response.body.user.password).toBeUndefined()

    const user = await User.findOne({
      email: 'john@example.com',
    }).select('+password')

    expect(user).not.toBeNull()
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.role).toBe('customer')
    expect(user.password).not.toBe('password123')

    const passwordMatches = await verifyPassword('password123', user.password)

    expect(passwordMatches).toBe(true)
  })

  test('POST /api/auth/register should reject a duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    const response = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'JOHN@EXAMPLE.COM',
      password: 'different123',
    })

    expect(response.statusCode).toBe(409)
    expect(response.body.message).toBe('Duplicate resource')
  })

  test('POST /api/auth/register should reject invalid registration data', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Name, email, and password are required')
  })

  test('POST /api/auth/register should reject a short password', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Name, email, and password are required')
  })

  test('POST /api/auth/register should reject missing required fields', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Name, email, and password are required')
  })
})

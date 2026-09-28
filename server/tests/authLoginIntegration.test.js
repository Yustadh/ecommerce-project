import request from 'supertest'
import User from '../models/userModel.js'
import app from '../app.js'
import { hashPassword } from '../utils/password.js'

describe('Login API integration', () => {
  beforeEach(async () => {
    const hashedPassword = await hashPassword('password123')

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'customer',
    })
  })

  test('POST /api/auth/login should authenticate a user successfully', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      message: 'Login successful',
      user: {
        id: expect.anything(),
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
      },
    })

    expect(response.body.user.password).toBeUndefined()
  })

  test('POST /api/auth/login should normalize the email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: '  JOHN@EXAMPLE.COM  ',
      password: 'password123',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.user.email).toBe('john@example.com')
  })

  test('POST /api/auth/login should reject an unknown email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'unknown@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('Invalid email or password')
  })

  test('POST /api/auth/login should reject an incorrect password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'wrong-password',
    })

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('Invalid email or password')
  })

  test('POST /api/auth/login should reject invalid login data', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'password123',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Email and password are required')
  })
})

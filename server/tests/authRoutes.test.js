import express from 'express'
import request from 'supertest'
import { jest } from '@jest/globals'

const mockRegister = jest.fn()

jest.unstable_mockModule('../controllers/authController.js', () => ({
  register: mockRegister,
}))

const { default: authRouter } = await import('../routes/authRoutes.js')

const app = express()

app.use(express.json())
app.use('/api/auth', authRouter)

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('POST /api/auth/register should call validation and registration controller', async () => {
    mockRegister.mockImplementation(async (req, res) => {
      res.status(201).json({
        message: 'Registration successful',
      })
    })

    const response = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(201)
    expect(mockRegister).toHaveBeenCalled()
  })

  test('POST /api/auth/register should reject an invalid email', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'not-an-email',
      password: 'password123',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Name, email, and password are required',
    })

    expect(mockRegister).not.toHaveBeenCalled()
  })
})

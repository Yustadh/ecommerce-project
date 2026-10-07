import express from 'express'
import request from 'supertest'
import { jest } from '@jest/globals'

const mockRegister = jest.fn()
const mockLogin = jest.fn()
const mockGetCurrentUser = jest.fn()

jest.unstable_mockModule('../controllers/authController.js', () => ({
  register: mockRegister,
  login: mockLogin,
  getCurrentUser: mockGetCurrentUser,
}))

const { default: authRouter } = await import('../routes/authRoutes.js')

const app = express()

app.use(express.json())
app.use('/api/auth', authRouter)

describe('Auth login routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('POST /api/auth/login should call the login controller', async () => {
    mockLogin.mockImplementation(async (req, res) => {
      res.status(200).json({
        message: 'Login successful',
      })
    })

    const response = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(200)
    expect(mockLogin).toHaveBeenCalled()
  })

  test('POST /api/auth/login should reject invalid email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'not-an-email',
      password: 'password123',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Email and password are required',
    })

    expect(mockLogin).not.toHaveBeenCalled()
  })

  test('POST /api/auth/login should reject a short password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: 'short',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'Email and password are required',
    })

    expect(mockLogin).not.toHaveBeenCalled()
  })
})

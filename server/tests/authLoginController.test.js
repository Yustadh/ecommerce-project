import { jest } from '@jest/globals'

const mockLoginUser = jest.fn()

jest.unstable_mockModule('../services/authService.js', () => ({
  registerUser: jest.fn(),
  loginUser: mockLoginUser,
}))

const { login } = await import('../controllers/authController.js')

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
})

describe('Auth login controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should login a user and return 200', async () => {
    const req = {
      body: {
        email: 'john@example.com',
        password: 'password123',
      },
    }

    const res = createResponse()

    mockLoginUser.mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
    })

    await login(req, res)

    expect(mockLoginUser).toHaveBeenCalledWith(req.body)

    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
      },
    })
  })

  test('should pass login errors to the error middleware', async () => {
    const req = {
      body: {
        email: 'john@example.com',
        password: 'wrong-password',
      },
    }

    const res = createResponse()
    const next = jest.fn()
    const loginError = new Error('Invalid email or password')
    loginError.statusCode = 401

    mockLoginUser.mockRejectedValue(loginError)

    await login(req, res, next)

    expect(next).toHaveBeenCalledWith(loginError)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})

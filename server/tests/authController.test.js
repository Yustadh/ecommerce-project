import { jest } from '@jest/globals'

const mockRegisterUser = jest.fn()

jest.unstable_mockModule('../services/authService.js', () => ({
  registerUser: mockRegisterUser,
}))

const { register } = await import('../controllers/authController.js')

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
})

describe('Auth controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should register a user and return 201', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    }

    const res = createResponse()

    mockRegisterUser.mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
    })

    await register(req, res)

    expect(mockRegisterUser).toHaveBeenCalledWith(req.body)

    expect(res.status).toHaveBeenCalledWith(201)

    expect(res.json).toHaveBeenCalledWith({
      message: 'Registration successful',
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
      },
    })
  })

  test('should pass registration errors to the error middleware', async () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()
    const registrationError = new Error('Duplicate email')

    mockRegisterUser.mockRejectedValue(registrationError)

    await register(req, res, next)

    expect(next).toHaveBeenCalledWith(registrationError)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})

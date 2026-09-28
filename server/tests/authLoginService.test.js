import { jest } from '@jest/globals'

const mockUserFindOne = jest.fn()
const mockVerifyPassword = jest.fn()

jest.unstable_mockModule('../models/userModel.js', () => ({
  default: {
    findOne: mockUserFindOne,
  },
}))

jest.unstable_mockModule('../utils/password.js', () => ({
  hashPassword: jest.fn(),
  verifyPassword: mockVerifyPassword,
}))

const { loginUser } = await import('../services/authService.js')

describe('Auth login service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should authenticate a user with valid credentials', async () => {
    const user = {
      _id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    }

    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    })

    mockVerifyPassword.mockResolvedValue(true)

    const result = await loginUser({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(mockUserFindOne).toHaveBeenCalledWith({
      email: 'john@example.com',
    })

    expect(mockVerifyPassword).toHaveBeenCalledWith(
      'password123',
      'hashed-password',
    )

    expect(result).toEqual({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
    })
  })

  test('should explicitly select the password hash', async () => {
    const select = jest.fn().mockResolvedValue({
      _id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    })

    mockUserFindOne.mockReturnValue({
      select,
    })

    mockVerifyPassword.mockResolvedValue(true)

    await loginUser({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(select).toHaveBeenCalledWith('+password')
  })

  test('should reject login when the user does not exist', async () => {
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    })

    await expect(
      loginUser({
        email: 'unknown@example.com',
        password: 'password123',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password',
    })

    expect(mockVerifyPassword).not.toHaveBeenCalled()
  })

  test('should reject login when the password is incorrect', async () => {
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'customer',
      }),
    })

    mockVerifyPassword.mockResolvedValue(false)

    await expect(
      loginUser({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  })

  test('should never expose the password in the returned user', async () => {
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'user-id',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        role: 'customer',
      }),
    })

    mockVerifyPassword.mockResolvedValue(true)

    const result = await loginUser({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(result).not.toHaveProperty('password')
    expect(result).not.toHaveProperty('hashedPassword')
  })

  test('should propagate unexpected database errors', async () => {
    const databaseError = new Error('Database unavailable')

    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockRejectedValue(databaseError),
    })

    await expect(
      loginUser({
        email: 'john@example.com',
        password: 'password123',
      }),
    ).rejects.toBe(databaseError)
  })
})

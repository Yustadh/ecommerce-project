import { jest } from '@jest/globals'

const mockUserCreate = jest.fn()
const mockHashPassword = jest.fn()

jest.unstable_mockModule('../models/userModel.js', () => ({
  default: {
    create: mockUserCreate,
  },
}))

jest.unstable_mockModule('../utils/password.js', () => ({
  hashPassword: mockHashPassword,
}))

const { registerUser } = await import('../services/authService.js')

describe('Auth service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a user with a hashed password', async () => {
    mockHashPassword.mockResolvedValue('hashed-password')

    mockUserCreate.mockResolvedValue({
      _id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    })

    const result = await registerUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(mockHashPassword).toHaveBeenCalledWith('password123')

    expect(mockUserCreate).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    })

    expect(result).toEqual({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
    })
  })

  test('should never expose the password in the returned user', async () => {
    mockHashPassword.mockResolvedValue('hashed-password')

    mockUserCreate.mockResolvedValue({
      _id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    })

    const result = await registerUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(result).not.toHaveProperty('password')
    expect(result).not.toHaveProperty('hashedPassword')
  })

  test('should never pass the plaintext password to User.create', async () => {
    mockHashPassword.mockResolvedValue('hashed-password')

    mockUserCreate.mockResolvedValue({
      _id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    })

    await registerUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(mockUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'hashed-password',
      }),
    )

    expect(mockUserCreate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'password123',
      }),
    )
  })

  test('should propagate a database error when user creation fails', async () => {
    const databaseError = new Error('Duplicate email')
    databaseError.code = 11000

    mockHashPassword.mockResolvedValue('hashed-password')
    mockUserCreate.mockRejectedValue(databaseError)

    await expect(
      registerUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    ).rejects.toBe(databaseError)

    expect(mockHashPassword).toHaveBeenCalledWith('password123')
    expect(mockUserCreate).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: 'customer',
    })
  })
})

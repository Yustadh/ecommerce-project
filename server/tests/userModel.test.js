import User from '../models/userModel.js'

describe('User model', () => {
  test('should create a valid user', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.role).toBe('customer')
  })

  test('should lowercase the email', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'JOHN@EXAMPLE.COM',
      password: 'password123',
    })

    expect(user.email).toBe('john@example.com')
  })

  test('should reject duplicate email addresses', async () => {
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    await expect(
      User.create({
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'password456',
      }),
    ).rejects.toMatchObject({
      code: 11000,
    })
  })

  test('should define a unique index on email', () => {
    const indexes = User.schema.indexes()

    expect(indexes).toEqual(
      expect.arrayContaining([[{ email: 1 }, { unique: true }]]),
    )
  })

  test('should reject a user without a name', async () => {
    await expect(
      User.create({
        email: 'john@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow()
  })

  test('should reject a user without an email', async () => {
    await expect(
      User.create({
        name: 'John Doe',
        password: 'password123',
      }),
    ).rejects.toThrow()
  })

  test('should reject a user without a password', async () => {
    await expect(
      User.create({
        name: 'John Doe',
        email: 'john@example.com',
      }),
    ).rejects.toThrow()
  })

  test('should reject a password shorter than 8 characters', async () => {
    await expect(
      User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short',
      }),
    ).rejects.toThrow()
  })

  test('should accept the admin role', async () => {
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    })

    expect(user.role).toBe('admin')
  })

  test('should reject an invalid role', async () => {
    await expect(
      User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'manager',
      }),
    ).rejects.toThrow()
  })
})

import { jest } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { generateToken, verifyToken } from '../utils/token.js'

describe('Token utility', () => {
  const user = {
    _id: 'user-id',
    role: 'customer',
  }

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
    process.env.JWT_EXPIRES_IN = '1h'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should generate a valid JWT', () => {
    const token = generateToken(user)

    expect(typeof token).toBe('string')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    expect(decoded.sub).toBe('user-id')
    expect(decoded.role).toBe('customer')
  })

  test('should use the user id when _id is unavailable', () => {
    const token = generateToken({
      id: 'user-id',
      role: 'admin',
    })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    expect(decoded.sub).toBe('user-id')
    expect(decoded.role).toBe('admin')
  })

  test('should verify a valid token', () => {
    const token = generateToken(user)

    const decoded = verifyToken(token)

    expect(decoded.sub).toBe('user-id')
    expect(decoded.role).toBe('customer')
  })

  test('should reject an invalid token', () => {
    expect(() => verifyToken('invalid-token')).toThrow()
  })

  test('should reject a token signed with a different secret', () => {
    const token = jwt.sign(
      {
        sub: 'user-id',
        role: 'customer',
      },
      'different-secret',
    )

    expect(() => verifyToken(token)).toThrow()
  })

  test('should reject token generation when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET

    expect(() => generateToken(user)).toThrow('JWT_SECRET is not configured')
  })

  test('should reject token verification when JWT_SECRET is missing', () => {
    const token = jwt.sign(
      {
        sub: 'user-id',
        role: 'customer',
      },
      'test-secret',
    )

    delete process.env.JWT_SECRET

    expect(() => verifyToken(token)).toThrow('JWT_SECRET is not configured')
  })
})

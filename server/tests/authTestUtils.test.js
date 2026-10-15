import jwt from 'jsonwebtoken'
import { createAuthToken } from './helpers/authTestUtils.js'

describe('Auth test utilities', () => {
  test('should create a customer token by default', () => {
    const token = createAuthToken()

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    expect(decoded.sub).toBe('test-user-id')
    expect(decoded.role).toBe('customer')
  })

  test('should create a token with the specified role', () => {
    const token = createAuthToken({
      id: 'admin-id',
      role: 'admin',
    })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    expect(decoded.sub).toBe('admin-id')
    expect(decoded.role).toBe('admin')
  })
})

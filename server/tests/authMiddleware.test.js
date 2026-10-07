import { jest } from '@jest/globals'

const mockVerifyToken = jest.fn()

jest.unstable_mockModule('../utils/token.js', () => ({
  verifyToken: mockVerifyToken,
}))

const { authenticate } = await import('../middleware/authMiddleware.js')

describe('Auth middleware', () => {
  const createResponse = () => {
    const res = {}

    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)

    return res
  }

  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should authenticate a valid bearer token', () => {
    const req = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    }

    const res = createResponse()

    mockVerifyToken.mockReturnValue({
      sub: 'user-id',
      role: 'customer',
    })

    authenticate(req, res, next)

    expect(mockVerifyToken).toHaveBeenCalledWith('valid-token')
    expect(req.user).toEqual({
      id: 'user-id',
      role: 'customer',
    })
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  test('should reject a request without an authorization header', () => {
    const req = {
      headers: {},
    }

    const res = createResponse()

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authentication required',
    })
    expect(next).not.toHaveBeenCalled()
    expect(mockVerifyToken).not.toHaveBeenCalled()
  })

  test('should reject an authorization header without Bearer scheme', () => {
    const req = {
      headers: {
        authorization: 'Basic valid-token',
      },
    }

    const res = createResponse()

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authentication required',
    })
    expect(next).not.toHaveBeenCalled()
    expect(mockVerifyToken).not.toHaveBeenCalled()
  })

  test('should reject an empty bearer token', () => {
    const req = {
      headers: {
        authorization: 'Bearer',
      },
    }

    const res = createResponse()

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authentication required',
    })
    expect(next).not.toHaveBeenCalled()
    expect(mockVerifyToken).not.toHaveBeenCalled()
  })

  test('should reject an invalid token', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    }

    const res = createResponse()

    mockVerifyToken.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject an expired token', () => {
    const req = {
      headers: {
        authorization: 'Bearer expired-token',
      },
    }

    const res = createResponse()

    const error = new Error('jwt expired')
    error.name = 'TokenExpiredError'

    mockVerifyToken.mockImplementation(() => {
      throw error
    })

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    })
    expect(next).not.toHaveBeenCalled()
  })
})

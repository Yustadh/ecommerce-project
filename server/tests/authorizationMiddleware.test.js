import { jest } from '@jest/globals'
import { authorize } from '../middleware/authorizationMiddleware.js'

describe('Authorization middleware', () => {
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

  test('should allow a user with an allowed role', () => {
    const req = {
      user: {
        id: 'admin-id',
        role: 'admin',
      },
    }

    const res = createResponse()

    authorize('admin')(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  test('should reject a user with a disallowed role', () => {
    const req = {
      user: {
        id: 'customer-id',
        role: 'customer',
      },
    }

    const res = createResponse()

    authorize('admin')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access denied',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a request without an authenticated user', () => {
    const req = {}
    const res = createResponse()

    authorize('admin')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Access denied',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('should allow any of multiple permitted roles', () => {
    const req = {
      user: {
        id: 'customer-id',
        role: 'customer',
      },
    }

    const res = createResponse()

    authorize('admin', 'customer')(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})

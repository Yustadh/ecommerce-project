import { jest } from '@jest/globals'
import { validateLogin } from '../middleware/authValidationMiddleware.js'

describe('Login validation middleware', () => {
  const createResponse = () => {
    const response = {
      status: jest.fn(),
      json: jest.fn(),
    }

    response.status.mockReturnValue(response)

    return response
  }

  test('should accept valid login data', () => {
    const req = {
      body: {
        email: '  JOHN@EXAMPLE.COM  ',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.body).toEqual({
      email: 'john@example.com',
      password: 'password123',
    })
    expect(res.status).not.toHaveBeenCalled()
  })

  test('should reject a missing email', () => {
    const req = {
      body: {
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a missing password', () => {
    const req = {
      body: {
        email: 'john@example.com',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject an invalid email format', () => {
    const req = {
      body: {
        email: 'not-an-email',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a password shorter than 8 characters', () => {
    const req = {
      body: {
        email: 'john@example.com',
        password: 'short',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a non-string email', () => {
    const req = {
      body: {
        email: 123,
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a non-string password', () => {
    const req = {
      body: {
        email: 'john@example.com',
        password: 12345678,
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })
})

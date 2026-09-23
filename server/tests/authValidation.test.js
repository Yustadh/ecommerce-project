import { jest } from '@jest/globals'
import { validateRegister } from '../middleware/authValidationMiddleware.js'

describe('Registration validation middleware', () => {
  const createResponse = () => {
    const response = {
      status: jest.fn(),
      json: jest.fn(),
    }

    response.status.mockReturnValue(response)

    return response
  }

  test('should accept valid registration data', () => {
    const req = {
      body: {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.body).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })
    expect(res.status).not.toHaveBeenCalled()
  })

  test('should reject a missing name', () => {
    const req = {
      body: {
        email: 'john@example.com',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a missing email', () => {
    const req = {
      body: {
        name: 'John Doe',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a password shorter than 8 characters', () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a non-string name', () => {
    const req = {
      body: {
        name: 123,
        email: 'john@example.com',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a non-string email', () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 123,
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject a non-string password', () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 12345678,
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should reject an invalid email format', () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('should accept a valid email format', () => {
    const req = {
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    }

    const res = createResponse()
    const next = jest.fn()

    validateRegister(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})

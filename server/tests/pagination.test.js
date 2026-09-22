import { parsePagination } from '../utils/pagination.js'

describe('parsePagination', () => {
  test('should use default pagination values', () => {
    expect(parsePagination()).toEqual({
      page: 1,
      limit: 10,
    })
  })

  test('should parse valid pagination values', () => {
    expect(parsePagination('2', '20')).toEqual({
      page: 2,
      limit: 20,
    })
  })

  test('should accept numeric pagination values', () => {
    expect(parsePagination(3, 25)).toEqual({
      page: 3,
      limit: 25,
    })
  })

  test('should accept the maximum limit of 100', () => {
    expect(parsePagination('1', '100')).toEqual({
      page: 1,
      limit: 100,
    })
  })

  test('should reject a limit greater than 100', () => {
    expect(() => parsePagination('1', '101')).toThrow('Invalid limit')
  })

  test('should assign a 400 status code when limit is greater than 100', () => {
    try {
      parsePagination('1', '101')
    } catch (error) {
      expect(error.message).toBe('Invalid limit')
      expect(error.statusCode).toBe(400)
    }
  })

  test('should reject an invalid page', () => {
    expect(() => parsePagination('abc', '10')).toThrow('Invalid page')
  })

  test('should reject page less than 1', () => {
    expect(() => parsePagination('0', '10')).toThrow('Invalid page')
  })

  test('should reject a non-integer page', () => {
    expect(() => parsePagination('1.5', '10')).toThrow('Invalid page')
  })

  test('should reject an invalid limit', () => {
    expect(() => parsePagination('1', 'abc')).toThrow('Invalid limit')
  })

  test('should reject limit less than 1', () => {
    expect(() => parsePagination('1', '0')).toThrow('Invalid limit')
  })

  test('should reject limit greater than 100', () => {
    expect(() => parsePagination('1', '101')).toThrow('Invalid limit')
  })

  test('should reject a non-integer limit', () => {
    expect(() => parsePagination('1', '10.5')).toThrow('Invalid limit')
  })

  test('should attach a 400 status code to page errors', () => {
    try {
      parsePagination('invalid', '10')
    } catch (error) {
      expect(error.statusCode).toBe(400)
    }
  })

  test('should attach a 400 status code to limit errors', () => {
    try {
      parsePagination('1', 'invalid')
    } catch (error) {
      expect(error.statusCode).toBe(400)
    }
  })
})

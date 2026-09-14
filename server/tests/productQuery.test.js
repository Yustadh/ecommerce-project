import { parseProductFields } from '../utils/productQuery.js'

describe('parseProductFields', () => {
  test('should return undefined when fields are not provided', () => {
    expect(parseProductFields()).toBeUndefined()
  })

  test('should parse a comma-separated list of valid fields', () => {
    expect(parseProductFields('name,price,category')).toBe(
      'name price category',
    )
  })

  test('should trim whitespace around fields', () => {
    expect(parseProductFields(' name, price, category ')).toBe(
      'name price category',
    )
  })

  test('should reject an empty fields value', () => {
    expect(() => parseProductFields('')).toThrow('Invalid fields')
  })

  test('should reject unknown fields', () => {
    expect(() => parseProductFields('name,password')).toThrow('Invalid fields')
  })

  test('should attach a 400 status code to validation errors', () => {
    try {
      parseProductFields('name,password')
    } catch (error) {
      expect(error.statusCode).toBe(400)
    }
  })
})
